import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { OrderService } from "./order.service";
import { ServiceEnum } from "@foodapp/utils/src/enums";
import { CartService } from "./cart.service";
import { CreateOrderDto } from "@foodapp/utils/src/dto";

@Controller()
export class OrderGrpcController {
  private readonly logger = new Logger(OrderGrpcController.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService
  ) {}

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "CreateOrder")
  create(data: CreateOrderDto) {
    this.logger.log(`Creating order: ${JSON.stringify(data)}`);
    return this.orderService.create(data);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "GetOrder")
  get(data: any) {
    return this.orderService.findOne(data.id);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "UpdateStatus")
  update(data: any) {
    return this.orderService.updateStatus(data.id, data.status);
  }
}
