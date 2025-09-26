import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Order } from './entities/order.entity';
import { OrderModule } from './order.module';

@Module({
  imports:[
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'foodapp',
      password: process.env.DB_PASS || 'foodapp',
      database: process.env.DB_NAME || 'foodapp',
      entities:[Order],
      synchronize: true
    }),
    // NATS client for emitting events
    ClientsModule.register([
      { name: 'NATS_EMITTER', transport: Transport.NATS, options: { servers: [process.env.NATS_URL || 'nats://localhost:4222'] } }
    ]),
    OrderModule
  ]
})
export class AppModule {}
