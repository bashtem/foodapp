import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap(){
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: { url: process.env.ORDER_GRPC_URL || '0.0.0.0:50051', package:'order.v1', protoPath: join(__dirname, '../../..', 'packages/proto/order.proto') }
  });
  await app.listen();
}
bootstrap();
