import { Injectable, Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientProxy, ClientGrpc } from "@nestjs/microservices";
import { Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { ServiceNatsEnum, ServiceEnum, ServiceGrpcEnum } from "@foodapp/utils/src/enums";
import { Cart } from "./entities/cart.entity";
import { CartItem } from "./entities/cart_item.entity";
import Redis from "ioredis";
import { firstValueFrom } from "rxjs";
import { RestaurantService } from "@foodapp/utils/src/interfaces";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  private redis: Redis;

  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @Inject(ServiceNatsEnum.ORDER_NATS) private readonly orderNats: ClientProxy,
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemRepo: Repository<CartItem>,
    @Inject(ServiceGrpcEnum.RESTAURANT_GRPC) private readonly restaurantClient: ClientGrpc
  ) {
    const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
    this.redis = new Redis(redisUrl);
    this.restaurantService = (((this.restaurantClient.getService <
      ServiceEnum.RESTAURANT_SERVICE) as any) > (ServiceEnum.RESTAURANT_SERVICE as any)) as any;
  }

  private restaurantService: RestaurantService;

  async create(data: { customer_id: string; restaurant_id: string; items: any[]; total?: number }) {
    const o = this.orderRepo.create({ ...data, total: data.total ?? 0 });
    const saved = await this.orderRepo.save(o);
    // emit async event over NATS
    // this.orderNats.emit("order.created", {
    //   orderId: saved.id,
    //   restaurantId: saved.restaurant_id,
    // });
    return saved;
  }

  // --- Cart operations ---
  private cartCacheKey(userId: string) {
    return `cart:${userId}`;
  }

  async getCart(userId: string) {
    // try cache
    const key = this.cartCacheKey(userId);
    const cached = await this.redis.get(key);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        this.logger.warn(`Failed to parse cached cart for user ${userId}: ${String(e)}`);
      }
    }

    // load from DB or create empty
    let cart = await this.cartRepo.findOne({ where: { userId }, relations: ["items"] });
    if (!cart) {
      cart = this.cartRepo.create({ userId, items: [] } as any);
      cart = await this.cartRepo.save(cart);
    }
    await this.redis.set(key, JSON.stringify(cart), "EX", 60 * 60 * 24); // 24h
    return cart;
  }

  async addCartItem(
    userId: string,
    menuItemId: string,
    restaurantId: string | undefined,
    quantity: number
  ) {
    const cart = (await this.getCart(userId)) as Cart;
    let item = cart.items.find(
      (i) => i.menuItemId === menuItemId && i.restaurantId === restaurantId
    );
    if (item) {
      item.quantity += quantity;
      await this.cartItemRepo.save(item);
    } else {
      item = this.cartItemRepo.create({
        cartId: cart.id,
        menuItemId,
        restaurantId: restaurantId || null,
        quantity,
      } as any);
      await this.cartItemRepo.save(item);
      cart.items.push(item as any);
    }
    await this.redis.set(this.cartCacheKey(userId), JSON.stringify(cart), "EX", 60 * 60 * 24);
    return cart;
  }

  async updateCartItem(userId: string, itemId: string, quantity: number) {
    const cart = (await this.getCart(userId)) as Cart;
    const item = await this.cartItemRepo.findOne({ where: { id: itemId } });
    if (!item || item.cartId !== cart.id) throw new Error("Item not found");
    item.quantity = quantity;
    await this.cartItemRepo.save(item);
    // refresh cart
    const updated = await this.cartRepo.findOne({ where: { id: cart.id }, relations: ["items"] });
    await this.redis.set(this.cartCacheKey(userId), JSON.stringify(updated), "EX", 60 * 60 * 24);
    return updated;
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

    // Lookup current prices for each menu item and calculate total.
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

    const order = await this.create({
      customer_id: userId,
      restaurant_id: "",
      items: orderItems,
      total,
    });

    // clear cart
    await this.clearCart(userId);
    return order;
  }

  findOne(id: string) {
    return this.orderRepo.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
    await this.orderRepo.update(id, { status });
    const updated = await this.findOne(id);
    // this.orderNats.emit("order.status.updated", { orderId: id, status });
    return updated;
  }
}
