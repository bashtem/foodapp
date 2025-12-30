import { Injectable, Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientGrpc, ClientProxy } from "@nestjs/microservices";
import { Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { ServiceEnum, ServiceGrpcEnum, ServiceNatsEnum } from "@foodapp/utils/src/enums";
import { CartService } from "./cart.service";
import { RpcException } from "@nestjs/microservices";
import { status as GrpcStatus } from "@grpc/grpc-js";
import { OrderStatus } from "@foodapp/utils/src/enums";
import { isValidTransition } from "./order.state";
import { CreateOrderDto } from "@foodapp/utils/src/dto";
import { ApiErrorCode } from "@foodapp/utils/src/response";
import { PaymentService } from "@foodapp/utils/src/interfaces";
import { firstValueFrom } from "rxjs";

@Injectable()
export class OrderService {
  private paymentService: PaymentService;
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @Inject(ServiceNatsEnum.ORDER_NATS) private readonly orderNats: ClientProxy,
    @Inject(ServiceGrpcEnum.PAYMENT_GRPC) private readonly paymentClient: ClientGrpc,
    private readonly cartService: CartService
  ) {
    this.paymentService = this.paymentClient.getService<PaymentService>(
      ServiceEnum.PAYMENT_SERVICE
    );
  }

  async findCart(userId: string, cartId: string) {
    const carts = await this.cartService.getCart(userId);
    const cart = carts.find(
      ({ id, isCheckedOut, userId: u }) => id === cartId && !isCheckedOut && u === userId
    );

    if (!cart) {
      this.logger.error(
        `Cart not found or already checked out for cart ID ${cartId} and user ID ${userId}`
      );
      throw new RpcException({ code: GrpcStatus.NOT_FOUND, message: ApiErrorCode.CART_NOT_FOUND });
    }
    return cart;
  }

  async create(data: CreateOrderDto) {
    this.logger.log(`Creating order for user ${data.userId} with cart ${data.cartId}`);
    const { userId, cartId, paymentProvider, deliveryAddress } = data;

    const cart = await this.findCart(userId, cartId);
    const { items: orderItems, totalPrice } = cart;
    const txRef = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const order = this.orderRepo.create({
      userId,
      restaurantId: cart.restaurantId,
      deliveryAddress,
      txRef,
      orderItems,
      total: totalPrice ?? 0,
    } as Partial<Order>);

    const savedOrder = await this.orderRepo.save(order);
    this.logger.log(`Order created with ID ${savedOrder.id}`);

    const paymentIntent = {
      order_id: savedOrder.id,
      amount: totalPrice ?? 0,
      currency: data.currency || "NGN",
      provider: paymentProvider,
      txRef,
    };

    this.logger.log(`Creating payment intent for order ${savedOrder.id}`);
    const payment = await firstValueFrom(this.paymentService.createIntent(paymentIntent));
    this.logger.log(`Payment intent created with ID ${payment.id} for order ${savedOrder.id}`);

    savedOrder.paymentId = payment.id;
    await this.orderRepo.save(savedOrder);
    return savedOrder;

    // this.orderNats.emit("order.created", {
    //   orderId: saved.id,
    //   restaurantId: saved.restaurantId,
    // });

    // await this.cartService.clearCart(userId); TODO:: clear cart after webhook confirmation
  }

  findOne(id: string) {
    return this.orderRepo.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
    const order = await this.findOne(id);
    if (!order) throw new RpcException({ code: GrpcStatus.NOT_FOUND, message: "Order not found" });

    const current = order.status as OrderStatus;
    const next = status as OrderStatus;
    if (!isValidTransition(current, next)) {
      throw new RpcException({
        code: GrpcStatus.FAILED_PRECONDITION,
        message: `Invalid status transition from ${current} to ${next}`,
      });
    }

    // append timeline
    const entry = { status: next, timestamp: new Date() };
    order.timeline = Array.isArray(order.timeline) ? [...order.timeline, entry] : [entry];
    order.status = next;

    await this.orderRepo.save(order);
    const updated = await this.findOne(id);
    this.orderNats.emit("order.status.updated", { orderId: id, status: next });
    return updated;
  }
}
