import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Inject,
  OnModuleInit,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";
import { OrderSvc } from "./orders.interface";

@Controller("orders")
export class OrdersController implements OnModuleInit {
  private svc!: OrderSvc;

  constructor(@Inject("ORDER_GRPC") private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.svc = this.client.getService<OrderSvc>("OrderService");
  }

  @Post() create(@Body() dto: any) {
    return firstValueFrom(this.svc.CreateOrder(dto).pipe(timeout(5000)));
  }

  @Get(":id") get(@Param("id") id: string) {
    return firstValueFrom(this.svc.GetOrder({ id }).pipe(timeout(4000)));
  }

  @Patch(":id/status") status(@Param("id") id: string, @Body() b: any) {
    return firstValueFrom(
      this.svc.UpdateStatus({ id, status: b.status }).pipe(timeout(4000))
    );
  }
}
