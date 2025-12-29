import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { ServiceEnum } from "@foodapp/utils/src/enums";
import { CartService } from "./cart.service";
import { status } from "@grpc/grpc-js";
import { ApiErrorCode } from "@foodapp/utils/src/response";
import {
  AddCartGrpcDto,
  CheckoutGrpcDto,
  RemoveCartItemDto,
  UpdateCartGrpcDto,
} from "@foodapp/utils/src/dto";

@Controller()
export class CartGrpcController {
  private readonly logger = new Logger(CartGrpcController.name);

  constructor(private readonly cartService: CartService) {}

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "GetCart")
  async getCart(data: { userId: string }) {
    const carts = await this.cartService.getCart(data.userId);

    if (!carts.length) {
      this.logger.warn(`Cart not found for user ID: ${data.userId}`);
      throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.CART_NOT_FOUND });
    }
    return { records: carts };
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "AddCartItem")
  async addCartItem(data: AddCartGrpcDto) {
    return this.cartService.addCartItem(data);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "UpdateCartItem")
  updateCartItem(data: UpdateCartGrpcDto) {
    return this.cartService.updateCartItem(data);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "RemoveCartItem")
  removeCartItem(data: RemoveCartItemDto) {
    const { userId, menuItemId } = data;
    return this.cartService.removeCartItem(userId, menuItemId);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "ClearCart")
  clearCart(data: { userId: string }) {
    return this.cartService.clearCart(data.userId);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "CheckoutCart")
  checkoutCart(data: CheckoutGrpcDto) {
    return this.cartService.checkoutCart(data);
  }
}
