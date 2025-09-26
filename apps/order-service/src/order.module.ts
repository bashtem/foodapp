import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { OrderGrpcController } from './order.grpc';
@Module({
  imports:[TypeOrmModule.forFeature([Order])],
  providers:[OrderService],
  controllers:[OrderGrpcController]
})
export class OrderModule {}
