import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { ServiceEnum } from "@foodapp/utils/src/enums";
import { CartService } from "./cart.service";
import { status } from "@grpc/grpc-js";
import { ApiErrorCode } from "@foodapp/utils/src/response";
import { UpdateCartGrpcDto } from "@foodapp/utils/src/dto";

@Controller()
export class CartGrpcController {
  private readonly logger = new Logger(CartGrpcController.name);

  constructor(private readonly cartService: CartService) {}

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "GetCart")
  async getCart(data: { userId: string }) {
    try {
      const cart = await this.cartService.getCart(data.userId);

      if (!cart) {
        this.logger.warn(`Cart not found for user ID: ${data.userId}`);
        throw new RpcException({ code: status.NOT_FOUND, message: ApiErrorCode.CART_NOT_FOUND });
      }
      return cart;
    } catch (error) {
      this.logger.error(`Failed to get cart: ${String(error)}`);
      throw new RpcException({
        code: status.INTERNAL,
        message: ApiErrorCode.CART_NOT_FOUND,
      });
    }
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "AddCartItem")
  async addCartItem(data: UpdateCartGrpcDto) {
    try {
      return this.cartService.addCartItem(data);
    } catch (error) {
      this.logger.error(`Failed to add cart item: ${String(error)}`);
      throw new RpcException({
        code: status.INTERNAL,
        message: ApiErrorCode.CART_ADD_ITEM_FAILED,
      });
    }
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "UpdateCartItem")
  updateCartItem(data: UpdateCartGrpcDto) {
    try {
      return this.cartService.updateCartItem(data);
    } catch (error) {
      this.logger.error(`Failed to update cart item: ${String(error)}`);
      throw new RpcException({
        code: status.INTERNAL,
        message: ApiErrorCode.CART_UPDATE_ITEM_FAILED,
      });
    }
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "RemoveCartItem")
  removeCartItem(data: { userId: string; itemId: string }) {
    return this.cartService.removeCartItem(data.userId, data.itemId);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "ClearCart")
  clearCart(data: { userId: string }) {
    return this.cartService.clearCart(data.userId);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "CheckoutCart")
  checkoutCart(data: { userId: string }) {
    return this.cartService.checkoutCart(data.userId);
  }
}
