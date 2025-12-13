import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { OrderService } from "./order.service";
import { ServiceEnum } from "@foodapp/utils/src/enums";

@Controller()
export class OrderGrpcController {
  private readonly logger = new Logger(OrderGrpcController.name);

  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "CreateOrder") create(data: any) {
    return this.orderService.create(data);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "GetOrder") get(data: any) {
    return this.orderService.findOne(data.id);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "UpdateStatus") upd(data: any) {
    return this.orderService.updateStatus(data.id, data.status);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "GetCart")
  getCart(data: { userId: string }) {
    return this.orderService.getCart(data.userId);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "AddCartItem")
  addCartItem(data: {
    userId: string;
    menuItemId: string;
    restaurantId?: string;
    quantity: number;
  }) {
    return this.orderService.addCartItem(
      data.userId,
      data.menuItemId,
      data.restaurantId,
      data.quantity
    );
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "UpdateCartItem")
  updateCartItem(data: { userId: string; itemId: string; quantity: number }) {
    return this.orderService.updateCartItem(data.userId, data.itemId, data.quantity);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "RemoveCartItem")
  removeCartItem(data: { userId: string; itemId: string }) {
    return this.orderService.removeCartItem(data.userId, data.itemId);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "ClearCart")
  clearCart(data: { userId: string }) {
    return this.orderService.clearCart(data.userId);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "CheckoutCart")
  checkoutCart(data: { userId: string }) {
    return this.orderService.checkoutCart(data.userId);
  }
}
