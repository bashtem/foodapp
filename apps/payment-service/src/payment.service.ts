import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

function randomRef(){ return 'ref_' + Math.random().toString(36).slice(2); }

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly repo: Repository<Payment>,
    @Inject('NATS_EMITTER') private readonly bus: ClientProxy,
  ){}
  async createIntent(data:{order_id:string; amount:number; currency?:string}){
    const p = this.repo.create({ order_id: data.order_id, amount: data.amount, currency: data.currency || 'NGN', status:'SUCCEEDED', reference: randomRef() });
    const saved = await this.repo.save(p);
    // emit async payment success
    this.bus.emit('payment.succeeded', { orderId: data.order_id, paymentId: saved.id, amount: saved.amount });
    return saved;
  }
}
