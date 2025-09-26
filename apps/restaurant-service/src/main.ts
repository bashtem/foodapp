import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap(){
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: { url: process.env.RESTAURANT_GRPC_URL || '0.0.0.0:50052', package:'restaurant.v1', protoPath: join(__dirname, '../../..', 'packages/proto/restaurant.proto') }
  });
  await app.listen();
}
bootstrap();
