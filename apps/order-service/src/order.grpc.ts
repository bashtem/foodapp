import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { OrderService } from "./order.service";
import { ServiceEnum } from "@foodapp/utils/src/enums";
import { CartService } from "./cart.service";

@Controller()
export class OrderGrpcController {
  private readonly logger = new Logger(OrderGrpcController.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService
  ) {}

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "CreateOrder") create(data: any) {
    return this.orderService.create(data);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "GetOrder") get(data: any) {
    return this.orderService.findOne(data.id);
  }

  @GrpcMethod(ServiceEnum.ORDER_SERVICE, "UpdateStatus") upd(data: any) {
    return this.orderService.updateStatus(data.id, data.status);
  }
}
