import { Injectable, Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientProxy } from "@nestjs/microservices";
import { Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { ServiceNatsEnum } from "@foodapp/utils/src/enums";
import { CartService } from "./cart.service";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @Inject(ServiceNatsEnum.ORDER_NATS) private readonly orderNats: ClientProxy,
    private readonly cartService: CartService
  ) {}

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

  async checkoutCart(userId: string) {
    const { orderItems, total } = await this.cartService.checkoutCart(userId);
    const order = await this.create({
      customer_id: userId,
      restaurant_id: "",
      items: orderItems,
      total,
    });
    await this.cartService.clearCart(userId);
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
