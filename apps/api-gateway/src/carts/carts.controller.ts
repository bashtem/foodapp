import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Inject,
  OnModuleInit,
  Logger,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ServiceEnum, ServiceGrpcEnum } from "@foodapp/utils/src/enums";
import { OrderService } from "@foodapp/utils/src/interfaces";
import { ApiSuccessCode, createResponse, grpcToHttpStatusMap } from "@foodapp/utils/src/response";
import { AddCartItemDto, UpdateCartItemDto } from "@foodapp/utils/src/dto";

// @UseGuards(AuthGuard) // FIXME:
@Controller("carts")
export class CartsController implements OnModuleInit {
  private orderService!: OrderService;
  private readonly logger = new Logger(CartsController.name);

  constructor(@Inject(ServiceGrpcEnum.ORDER_GRPC) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.orderService = this.client.getService<OrderService>(ServiceEnum.ORDER_SERVICE);
  }

  @Get(":userId")
  async get(@Param("userId", ParseUUIDPipe) userId: string) {
    try {
      const carts = await firstValueFrom(this.orderService.getCart({ userId }));
      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.CART_GET_SUCCESS,
        data: carts,
      });
    } catch (error: any) {
      this.logger.error(`Failed to get cart: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Post(":userId/items")
  async addItem(@Param("userId", ParseUUIDPipe) userId: string, @Body() body: AddCartItemDto) {
    this.logger.log(`Adding item to cart for user ${userId}`);
    try {
      const cart = await firstValueFrom(this.orderService.addCartItem({ userId, ...body }));

      return createResponse({
        statusCode: HttpStatus.CREATED,
        message: ApiSuccessCode.CART_ADD_ITEM_SUCCESS,
        data: cart,
      });
    } catch (error: any) {
      this.logger.error(`Failed to add cart item: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Patch(":userId/items/:itemId")
  async updateItem(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Param("itemId", ParseUUIDPipe) menuItemId: string,
    @Body() body: UpdateCartItemDto
  ) {
    this.logger.log(`Updating item ${menuItemId} in cart for user ${userId}`);
    try {
      const cart = await firstValueFrom(
        this.orderService.updateCartItem({ userId, menuItemId, ...body })
      );

      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.CART_UPDATE_ITEM_SUCCESS,
        data: cart,
      });
    } catch (error: any) {
      this.logger.error(`Failed to update cart item: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Delete(":userId/items/:itemId")
  async removeItem(@Param("userId") userId: string, @Param("itemId") itemId: string) {
    try {
      const res = await firstValueFrom(this.orderService.removeCartItem({ userId, itemId }));
      return res;
    } catch (error: any) {
      this.logger.error(`Failed to remove cart item: ${error.message}`);
      throw new HttpException(error.details || error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(":userId/clear")
  async clear(@Param("userId", ParseUUIDPipe) userId: string) {
    try {
      const res = await firstValueFrom(this.orderService.clearCart({ userId }));
      return res;
    } catch (error: any) {
      this.logger.error(`Failed to clear cart: ${error.message}`);
      throw new HttpException(error.details || error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(":userId/checkout")
  async checkout(@Param("userId", ParseUUIDPipe) userId: string) {
    try {
      const res = await firstValueFrom(this.orderService.checkoutCart({ userId }));
      return res;
    } catch (error: any) {
      this.logger.error(`Failed to checkout cart: ${error.message}`);
      throw new HttpException(error.details || error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
