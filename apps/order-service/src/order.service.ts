import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly repo: Repository<Order>,
    @Inject('NATS_EMITTER') private readonly bus: ClientProxy,
  ){}

  async create(data: {customer_id:string; restaurant_id:string; items:any[]; total?:number}){
    const o = this.repo.create({ ...data, total: data.total ?? 0 });
    const saved = await this.repo.save(o);
    // emit async event over NATS
    this.bus.emit('order.created', { orderId: saved.id, restaurantId: saved.restaurant_id });
    return saved;
  }
  findOne(id: string){ return this.repo.findOne({ where:{ id }}); }
  async updateStatus(id: string, status: string){
    await this.repo.update(id, { status });
    const updated = await this.findOne(id);
    this.bus.emit('order.status.updated', { orderId: id, status });
    return updated;
  }
}
