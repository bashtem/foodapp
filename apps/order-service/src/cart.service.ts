import { Injectable, Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { firstValueFrom } from "rxjs";
import { ClientGrpc, RpcException } from "@nestjs/microservices";
import { Cart } from "./entities/cart.entity";
import { ServiceGrpcEnum, ServiceEnum } from "@foodapp/utils/src/enums";
import { RestaurantService } from "@foodapp/utils/src/interfaces";
import {
  UpdateCartGrpcDto,
  CartItemDto,
  AddCartGrpcDto,
  CheckoutGrpcDto,
  CheckoutResponseDto,
  CheckoutResultDto,
  MenuItemResponseDto,
} from "@foodapp/utils/src/dto";
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

  newCartItem(menuItem: MenuItemResponseDto): CartItemDto {
    const { id, name, price: priceSnapshot, restaurantId, isAvailable } = menuItem;
    return { menuItemId: id, name, priceSnapshot, restaurantId, isAvailable, quantity: 0 };
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

    const newItem = this.newCartItem(menuItem);
    newItem.quantity = quantity;
    cart.totalPrice += +(newItem.priceSnapshot * quantity).toFixed(2);
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

    const menuItem = await this.findMenuItem(menuItemId);
    const newItem = this.newCartItem(menuItem);
    newItem.quantity = quantity;

    const cart = this.cartRepo.create({
      userId,
      restaurantId: newItem.restaurantId,
      items: [newItem],
      totalPrice: +(newItem.priceSnapshot * quantity).toFixed(2),
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

  private async fetchMenuForRestaurant(restaurantId: string) {
    this.logger.log(`Fetching menu for restaurant ${restaurantId}`);
    try {
      const menu = await firstValueFrom(this.restaurantService.getMenu({ restaurantId }));
      return menu.records;
    } catch (err) {
      this.logger.error(`Failed fetching menu for restaurant ${restaurantId}`, err as any);
      throw new RpcException({
        code: status.UNAVAILABLE,
        message: ApiErrorCode.MENU_ITEM_NOT_FOUND,
      });
    }
  }

  private async validateAndSnapshotCart(cart: Cart, userId: string) {
    const menuItems = await this.fetchMenuForRestaurant(cart.restaurantId as string);
    const hashMap = new Map<string, MenuItemResponseDto>();
    for (const menu of menuItems) hashMap.set(menu.id, menu);

    // Validate each item and refresh priceSnapshot if changed
    let total = 0;
    for (const item of cart.items) {
      const { menuItemId, restaurantId } = item;
      const menuItem = hashMap.get(menuItemId);

      if (!menuItem) {
        this.logger.warn(`Menu item ${menuItemId} not found in restaurant ${restaurantId}`);
        item.isAvailable = false;
        continue;
      }

      if (!menuItem.isAvailable) this.logger.warn(`Menu item ${menuItemId} is not available`);

      item.priceSnapshot = +menuItem.price.toFixed(2);
      total += +(item.priceSnapshot * item.quantity).toFixed(2);
    }

    if (cart.totalPrice !== total) {
      this.logger.log(`Cart total price updated from ${cart.totalPrice} to ${total}`);
      cart.totalPrice = +total.toFixed(2);
      await this.cartRepo.save(cart);
      await this.cacheManager.del(this.cartCacheKey(userId));
    }

    return cart;
  }

  async checkoutCart(data: CheckoutGrpcDto): Promise<CheckoutResultDto> {
    const { userId, restaurantId } = data;
    this.logger.log(`Checking out cart for user ${userId} and restaurant ${restaurantId}`);

    const carts = await this.getCart(userId);
    if (!carts.length) {
      this.logger.warn(`Cart not found for user ${userId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.CART_NOT_FOUND });
    }

    const cart = carts.find((cart) => cart.restaurantId === restaurantId);
    if (!cart) {
      this.logger.warn(`Cart for restaurant ${restaurantId} not found for user ${userId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.CART_NOT_FOUND });
    }

    // validate items against restaurant menu and refresh price snapshots
    const validatedCart = await this.validateAndSnapshotCart(cart, userId);

    const orderItems = validatedCart.items.map<CheckoutResponseDto>((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      unitPrice: item.priceSnapshot as number,
      isAvailable: item.isAvailable,
    }));

    const totalPrice = validatedCart.totalPrice;
    return { cartId: validatedCart.id, orderItems, totalPrice };
  }
}
