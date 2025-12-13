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
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ServiceEnum, ServiceGrpcEnum } from "@foodapp/utils/src/enums";
import { OrderService } from "@foodapp/utils/src/interfaces";

// @UseGuards(AuthGuard) // integrate auth when ready
@Controller("carts")
export class CartsController implements OnModuleInit {
  private orderService!: OrderService;
  private readonly logger = new Logger(CartsController.name);

  constructor(@Inject(ServiceGrpcEnum.ORDER_GRPC) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.orderService = this.client.getService<OrderService>(ServiceEnum.ORDER_SERVICE);
  }

  @Get(":userId")
  async get(@Param("userId") userId: string) {
    try {
      const res = await firstValueFrom(this.orderService.getCart({ userId }));
      return res;
    } catch (error: any) {
      this.logger.error(`Failed to get cart: ${error.message}`);
      throw new HttpException(error.details || error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(":userId/items")
  async addItem(@Param("userId") userId: string, @Body() body: any) {
    try {
      const res = await firstValueFrom(
        this.orderService.addCartItem({
          userId,
          menuItemId: body.menuItemId,
          restaurantId: body.restaurantId,
          quantity: body.quantity,
        })
      );
      return res;
    } catch (error: any) {
      this.logger.error(`Failed to add cart item: ${error.message}`);
      throw new HttpException(error.details || error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(":userId/items/:itemId")
  async updateItem(
    @Param("userId") userId: string,
    @Param("itemId") itemId: string,
    @Body() body: any
  ) {
    try {
      const res = await firstValueFrom(
        this.orderService.updateCartItem({ userId, itemId, quantity: body.quantity })
      );
      return res;
    } catch (error: any) {
      this.logger.error(`Failed to update cart item: ${error.message}`);
      throw new HttpException(error.details || error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
  async clear(@Param("userId") userId: string) {
    try {
      const res = await firstValueFrom(this.orderService.clearCart({ userId }));
      return res;
    } catch (error: any) {
      this.logger.error(`Failed to clear cart: ${error.message}`);
      throw new HttpException(error.details || error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(":userId/checkout")
  async checkout(@Param("userId") userId: string) {
    try {
      const res = await firstValueFrom(this.orderService.checkoutCart({ userId }));
      return res;
    } catch (error: any) {
      this.logger.error(`Failed to checkout cart: ${error.message}`);
      throw new HttpException(error.details || error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
