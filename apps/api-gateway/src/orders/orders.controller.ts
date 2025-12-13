import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Inject,
  OnModuleInit,
  Logger,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { OrderService } from "@foodapp/utils/src/interfaces";
import { ServiceEnum, ServiceGrpcEnum } from "@foodapp/utils/src/enums";

// @UseGuards(AuthGuard) FIXME:
@Controller("orders")
export class OrdersController implements OnModuleInit {
  private orderService!: OrderService;

  private readonly logger = new Logger(OrdersController.name);
  constructor(@Inject(ServiceGrpcEnum.ORDER_GRPC) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.orderService = this.client.getService<OrderService>(ServiceEnum.ORDER_SERVICE);
  }

  @Post() create(@Body() dto: any) {
    return firstValueFrom(this.orderService.createOrder(dto));
  }

  @Get(":id") get(@Param("id") id: string) {
    return firstValueFrom(this.orderService.getOrder({ id }));
  }

  @Patch(":id/status") status(@Param("id") id: string, @Body() b: any) {
    return firstValueFrom(this.orderService.updateStatus({ id, status: b.status }));
  }
}
