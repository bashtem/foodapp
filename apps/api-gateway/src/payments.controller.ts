import { Controller, Post, Body, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
interface PaySvc { CreateIntent(req:any): any; }
@Controller('payments')
export class PaymentsController implements OnModuleInit {
  private svc: PaySvc;
  constructor(@Inject('PAYMENT_GRPC') private readonly client: ClientGrpc){}
  onModuleInit(){ this.svc = this.client.getService<PaySvc>('PaymentService'); }
  @Post('intent') intent(@Body() body:any){ return firstValueFrom(this.svc.CreateIntent(body).pipe(timeout(5000))); }
}
