import { Injectable, Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { firstValueFrom } from "rxjs";
import { ClientGrpc } from "@nestjs/microservices";
import { Cart } from "./entities/cart.entity";
import { ServiceGrpcEnum, ServiceEnum } from "@foodapp/utils/src/enums";
import { RestaurantService } from "@foodapp/utils/src/interfaces";
import { UpdateCartGrpcDto, CartItemDto } from "@foodapp/utils/src/dto";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  private restaurantService: RestaurantService;

  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @Inject(ServiceGrpcEnum.RESTAURANT_GRPC) private readonly restaurantClient: ClientGrpc,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.restaurantService = this.restaurantClient.getService<RestaurantService>(
      ServiceEnum.RESTAURANT_SERVICE
    );
  }

  private cartCacheKey(userId: string) {
    return `cart:${userId}`;
  }

  async getCart(userId: string) {
    this.logger.log(`Fetching carts for user ${userId}`);
    const key = this.cartCacheKey(userId);

    const cached = await this.cacheManager.get<string>(key);
    if (cached) return JSON.parse(cached) as Cart[];

    return this.cartRepo.find({ where: { userId } });
  }

  async updateCache(userId: string, carts: Cart[]) {
    await this.cacheManager.set(this.cartCacheKey(userId), JSON.stringify(carts));
  }

  async findMenuItem(menuItemId: string, restaurantId: string) {
    this.logger.log(`Fetching menu item ${menuItemId} for restaurant ${restaurantId}`);
    const menuItem = await firstValueFrom(
      this.restaurantService.getMenuItem({ id: menuItemId, restaurantId })
    );
    if (!menuItem) {
      this.logger.warn(`Menu item ${menuItemId} not found for restaurant ${restaurantId}`);
      throw new Error("Menu item not found");
    }
    return menuItem;
  }

  async addCartItem(data: UpdateCartGrpcDto) {
    const { userId, menuItemId, restaurantId, quantity } = data;
    let newItem: CartItemDto = { menuItemId, quantity, restaurantId };
    this.logger.log(`Adding item ${menuItemId} (qty: ${quantity}) to cart for user ${userId}`);

    const carts = await this.getCart(userId);
    const cartIndex = carts.findIndex((cart) => cart.restaurantId === restaurantId);
    if (cartIndex === -1) return this.createCart(data, carts);
    const cart = carts[cartIndex];

    const existingItem = cart.items.find((it) => it.menuItemId === menuItemId);
    if (existingItem) {
      this.logger.log(`Item ${menuItemId} exists in cart`);
      throw new Error("Item already exists in cart");
    }

    const menuItem = await this.findMenuItem(menuItemId, restaurantId);
    newItem = { ...newItem, name: menuItem.name, priceSnapshot: menuItem.price };
    cart.totalPrice += +(menuItem.price * quantity).toFixed(2);
    cart.items.push(newItem);

    await this.cartRepo.save(cart);
    carts[cartIndex] = cart;
    await this.updateCache(userId, carts);
    return cart;
  }

  async createCart(data: UpdateCartGrpcDto, carts: Cart[] = []) {
    const { userId, menuItemId, restaurantId, quantity } = data;
    this.logger.log(`Creating new cart for user ${userId} and restaurant ${restaurantId}`);

    let newItem: CartItemDto = { menuItemId, quantity, restaurantId };
    const menuItem = await this.findMenuItem(menuItemId, restaurantId);

    newItem = { ...newItem, name: menuItem.name, priceSnapshot: menuItem.price };
    const cart = this.cartRepo.create({
      userId,
      restaurantId,
      items: [newItem],
      totalPrice: +(menuItem.price * quantity).toFixed(2),
    });
    await this.cartRepo.save(cart);
    carts.push(cart);
    await this.updateCache(userId, carts);
    return cart;
  }

  async updateCartItem(data: UpdateCartGrpcDto) {
    const { userId, menuItemId, restaurantId, quantity } = data;
    this.logger.log(`Updating item ${menuItemId} to qty ${quantity} in cart for user ${userId}`);

    const carts = await this.getCart(userId);
    const cartIndex = carts?.findIndex((cart) => cart.restaurantId === restaurantId);
    if (cartIndex === -1) {
      this.logger.warn(`Cart not found for restaurant ${restaurantId} and user ${userId}`);
      throw new Error("Cart not found for restaurant");
    }

    const cart = carts[cartIndex];
    const itemIndex = cart.items.findIndex((it) => it.menuItemId === menuItemId);
    if (itemIndex === -1) {
      this.logger.warn(`Item ${menuItemId} not found in cart for user ${userId}`);
      throw new Error("Item not found in cart");
    }

    await this.findMenuItem(menuItemId, restaurantId);
    const item = cart.items[itemIndex];
    cart.totalPrice -= +((item.priceSnapshot as number) * item.quantity).toFixed(2);
    item.quantity = quantity;
    cart.totalPrice += +((item.priceSnapshot as number) * quantity).toFixed(2);
    // cart.items[itemIndex] = item;

    await this.cartRepo.save(cart);
    carts[cartIndex] = cart;
    await this.updateCache(userId, carts);
    return cart;
  }

  async removeCartItem(userId: string, itemId: string) {
    const cart = (await this.getCart(userId)) as Cart;
    const item = await this.cartItemRepo.findOne({ where: { id: itemId } });
    if (!item || item.cartId !== cart.id) throw new Error("Item not found");
    await this.cartItemRepo.delete(itemId);
    const updated = await this.cartRepo.findOne({ where: { id: cart.id }, relations: ["items"] });
    await this.redis.set(this.cartCacheKey(userId), JSON.stringify(updated), "EX", 60 * 60 * 24);
    return updated;
  }

  async clearCart(userId: string) {
    const cart = (await this.getCart(userId)) as Cart;
    await this.cartItemRepo.delete({ cartId: cart.id } as any);
    const updated = await this.cartRepo.findOne({ where: { id: cart.id }, relations: ["items"] });
    await this.redis.del(this.cartCacheKey(userId));
    return updated;
  }

  async checkoutCart(userId: string) {
    const cart = (await this.getCart(userId)) as Cart;
    if (!cart || !cart.items || cart.items.length === 0) throw new Error("Cart empty");

    let total = 0;
    const orderItems: any[] = [];

    for (const it of cart.items) {
      if (!it.restaurantId)
        throw new Error("Missing restaurantId for cart item; cannot lookup price");
      try {
        const resp = await firstValueFrom(
          this.restaurantService.getMenuItem({
            id: it.menuItemId,
            restaurantId: it.restaurantId,
          }) as any
        );
        const price = Number((resp && (resp as any).price) || 0);
        total += price * (it.quantity || 0);
        orderItems.push({ menu_item_id: it.menuItemId, quantity: it.quantity, unit_price: price });
      } catch (e) {
        this.logger.warn(`Failed to fetch price for menuItem ${it.menuItemId}: ${String(e)}`);
        throw new Error(`Failed to fetch price for menu item ${it.menuItemId}`);
      }
    }

    return { orderItems, total };
  }
}
