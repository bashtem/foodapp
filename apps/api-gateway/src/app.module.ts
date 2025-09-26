import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrdersController } from './orders.controller';
import { RestaurantsController } from './restaurants.controller';
import { PaymentsController } from './payments.controller';

@Module({
  imports:[ClientsModule.register([
    { name:'ORDER_GRPC', transport: Transport.GRPC, options:{ url: process.env.ORDER_GRPC_ADDR || 'localhost:50051', package:'order.v1', protoPath: join(__dirname, '../../..', 'packages/proto/order.proto') } },
    { name:'RESTAURANT_GRPC', transport: Transport.GRPC, options:{ url: process.env.RESTAURANT_GRPC_ADDR || 'localhost:50052', package:'restaurant.v1', protoPath: join(__dirname, '../../..', 'packages/proto/restaurant.proto') } },
    { name:'PAYMENT_GRPC', transport: Transport.GRPC, options:{ url: process.env.PAYMENT_GRPC_ADDR || 'localhost:50053', package:'payment.v1', protoPath: join(__dirname, '../../..', 'packages/proto/payment.proto') } }
  ])],
  controllers:[OrdersController, RestaurantsController, PaymentsController]
})
export class AppModule {}
