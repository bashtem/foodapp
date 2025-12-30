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
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { OrderService } from "@foodapp/utils/src/interfaces";
import { ServiceEnum, ServiceGrpcEnum } from "@foodapp/utils/src/enums";
import { CreateOrderDto } from "@foodapp/utils/src/dto";
import { ApiSuccessCode, createResponse, grpcToHttpStatusMap } from "@foodapp/utils/src/response";

// @UseGuards(AuthGuard) FIXME:
@Controller("orders")
export class OrdersController implements OnModuleInit {
  private orderService!: OrderService;
  private readonly logger = new Logger(OrdersController.name);

  constructor(@Inject(ServiceGrpcEnum.ORDER_GRPC) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.orderService = this.client.getService<OrderService>(ServiceEnum.ORDER_SERVICE);
  }

  @Post()
  async create(@Body() body: CreateOrderDto) {
    this.logger.log(`Creating order for user ${body.userId}`);
    try {
      const result = await firstValueFrom(this.orderService.createOrder(body));

      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.ORDER_CREATE_SUCCESS,
        data: result,
      });
    } catch (error: any) {
      this.logger.error(`Failed to create order: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return firstValueFrom(this.orderService.getOrder({ id }));
  }

  @Patch(":id/status")
  status(@Param("id") id: string, @Body() b: any) {
    return firstValueFrom(this.orderService.updateStatus({ id, status: b.status }));
  }
}
