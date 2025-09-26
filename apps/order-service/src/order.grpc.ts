import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
export class OrderGrpcController {
  constructor(private readonly svc: OrderService){}
  @GrpcMethod('OrderService','CreateOrder') create(data:any){ return this.svc.create(data); }
  @GrpcMethod('OrderService','GetOrder') get(data:any){ return this.svc.findOne(data.id); }
  @GrpcMethod('OrderService','UpdateStatus') upd(data:any){ return this.svc.updateStatus(data.id, data.status); }
}
