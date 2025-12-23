import { Injectable, Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { firstValueFrom } from "rxjs";
import { ClientGrpc, RpcException } from "@nestjs/microservices";
import { Cart } from "./entities/cart.entity";
import { ServiceGrpcEnum, ServiceEnum } from "@foodapp/utils/src/enums";
import { RestaurantService } from "@foodapp/utils/src/interfaces";
import { UpdateCartGrpcDto, CartItemDto, AddCartGrpcDto } from "@foodapp/utils/src/dto";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { status } from "@grpc/grpc-js";
import { ApiErrorCode } from "@foodapp/utils/src/response";

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

  async updateCache(userId: string, carts: Cart[]) {
    await this.cacheManager.set(this.cartCacheKey(userId), JSON.stringify(carts));
  }

  async getCart(userId: string) {
    this.logger.log(`Fetching carts for user ${userId}`);
    const key = this.cartCacheKey(userId);

    const cached = await this.cacheManager.get<string>(key);
    if (cached) return JSON.parse(cached) as Cart[];

    const carts = await this.cartRepo.find({ where: { userId } });
    if (carts.length) await this.updateCache(userId, carts);
    return carts;
  }

  async findMenuItem(menuItemId: string) {
    this.logger.log(`Fetching menu item ${menuItemId}`);
    const menuItem = await firstValueFrom(this.restaurantService.getMenuItem({ id: menuItemId }));
    if (!menuItem) {
      this.logger.warn(`Menu item ${menuItemId} not found`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.MENU_ITEM_NOT_FOUND });
    }
    return menuItem;
  }

  async addCartItem(data: AddCartGrpcDto) {
    const { userId, menuItemId, quantity } = data;
    this.logger.log(`Adding item ${menuItemId} (qty: ${quantity}) to cart for user ${userId}`);

    const carts = await this.getCart(userId);
    const menuItem = await this.findMenuItem(menuItemId);
    const cart = carts.find((cart) => cart.restaurantId === menuItem.restaurantId);
    if (!cart) return this.createCart(data, carts);

    const existingItem = cart.items.find((item) => item.menuItemId === menuItemId);
    if (existingItem) {
      this.logger.warn(`Item ${menuItemId} exists in cart`);
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: ApiErrorCode.CART_ITEM_ALREADY_EXISTS,
      });
    }

    const { name, price: priceSnapshot, restaurantId } = menuItem;
    const newItem: CartItemDto = { menuItemId, restaurantId, name, quantity, priceSnapshot };
    cart.totalPrice += +(priceSnapshot * quantity).toFixed(2);
    cart.items.push(newItem);

    await this.cartRepo.save(cart);
    await this.updateCache(userId, carts);
    return cart;
  }

  async createCart(data: AddCartGrpcDto, carts: Cart[] = []) {
    const { userId, menuItemId, quantity } = data;
    this.logger.log(
      `Creating new cart with item ${menuItemId} (qty: ${quantity}) for user ${userId}`
    );

    const { name, price: priceSnapshot, restaurantId } = await this.findMenuItem(menuItemId);
    const newItem: CartItemDto = { menuItemId, restaurantId, name, quantity, priceSnapshot };
    const cart = this.cartRepo.create({
      userId,
      restaurantId,
      items: [newItem],
      totalPrice: +(priceSnapshot * quantity).toFixed(2),
    });
    await this.cartRepo.save(cart);
    carts.push(cart);
    await this.updateCache(userId, carts);
    return cart;
  }

  async updateCartItem(data: UpdateCartGrpcDto) {
    const { userId, menuItemId, quantity } = data;
    this.logger.log(`Updating item ${menuItemId} to qty ${quantity} in cart for user ${userId}`);

    const carts = await this.getCart(userId);
    const cart = carts.find((cart) => cart.items.some((item) => item.menuItemId === menuItemId));
    if (!cart) {
      this.logger.warn(`Cart not found for user ${userId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.CART_NOT_FOUND });
    }

    const item = cart.items.find((item) => item.menuItemId === menuItemId);
    if (!item) {
      this.logger.warn(`Item ${menuItemId} not found in cart for user ${userId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.CART_ITEM_NOT_FOUND });
    }

    await this.findMenuItem(menuItemId);
    cart.totalPrice -= +((item.priceSnapshot as number) * item.quantity).toFixed(2);
    item.quantity = quantity;
    cart.totalPrice += +((item.priceSnapshot as number) * quantity).toFixed(2);

    await this.cartRepo.save(cart);
    await this.updateCache(userId, carts);
    return cart;
  }

  async removeCartItem(userId: string, menuItemId: string) {
    this.logger.log(`Removing item ${menuItemId} from cart for user ${userId}`);

    const carts = await this.getCart(userId);
    if (!carts.length) {
      this.logger.warn(`Cart not found for user ${userId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.CART_NOT_FOUND });
    }

    const cart = carts.find((cart) => cart.items.some((item) => item.menuItemId === menuItemId));
    if (!cart) {
      this.logger.warn(`Item ${menuItemId} not found in any cart for user ${userId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.CART_ITEM_NOT_FOUND });
    }
    if (cart.items.length === 1) return this.removeCart(cart, carts, userId);

    const itemIndex = cart.items.findIndex((item) => item.menuItemId === menuItemId);
    const item = cart.items[itemIndex];
    cart.totalPrice -= +((item.priceSnapshot as number) * item.quantity).toFixed(2);
    cart.items.splice(itemIndex, 1);

    await this.cartRepo.save(cart);
    await this.updateCache(userId, carts);
    return cart;
  }

  async removeCart(cart: Cart, carts: Cart[], userId: string) {
    this.logger.log(`Removing entire cart for user ${userId} as it has only one item`);
    const index = carts.findIndex((cart) => cart.id === cart.id);
    carts.splice(index, 1);
    await this.cartRepo.delete(cart.id);
    await this.updateCache(userId, carts);
    return { ...cart, items: [], totalPrice: 0 };
  }

  async clearCart(userId: string) {
    this.logger.log(`Clearing cart for user ${userId}`);
    const carts = await this.getCart(userId);

    if (!carts.length) {
      this.logger.warn(`Cart not found for user ${userId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.CART_NOT_FOUND });
    }

    await this.cartRepo.delete({ userId });
    await this.cacheManager.del(this.cartCacheKey(userId));
    return;
  }

  async checkoutCart(userId: string) {
    const carts = await this.getCart(userId);
    this.logger.log(`Checking out cart for user ${userId}`);
    if (!carts.length) {
      this.logger.warn(`Cart not found for user ${userId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.CART_NOT_FOUND });
    }
    // if (!cart || !cart.items || cart.items.length === 0) throw new Error("Cart empty");
    // let total = 0;
    // const orderItems: any[] = [];
    // for (const it of cart.items) {
    //   if (!it.restaurantId)
    //     throw new Error("Missing restaurantId for cart item; cannot lookup price");
    //   try {
    //     const resp = await firstValueFrom(
    //       this.restaurantService.getMenuItem({
    //         id: it.menuItemId,
    //         restaurantId: it.restaurantId,
    //       }) as any
    //     );
    //     const price = Number((resp && (resp as any).price) || 0);
    //     total += price * (it.quantity || 0);
    //     orderItems.push({ menu_item_id: it.menuItemId, quantity: it.quantity, unit_price: price });
    //   } catch (e) {
    //     this.logger.warn(`Failed to fetch price for menuItem ${it.menuItemId}: ${String(e)}`);
    //     throw new Error(`Failed to fetch price for menu item ${it.menuItemId}`);
    //   }
    // }
    // return { orderItems, total };
  }
}
