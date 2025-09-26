import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap(){
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: { url: process.env.PAYMENT_GRPC_URL || '0.0.0.0:50053', package:'payment.v1', protoPath: join(__dirname, '../../..', 'packages/proto/payment.proto') }
  });
  await app.listen();
}
bootstrap();
