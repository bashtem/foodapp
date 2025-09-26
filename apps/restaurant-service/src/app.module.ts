import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Restaurant } from './entities/restaurant.entity';
import { MenuItem } from './entities/menu_item.entity';
import { RestaurantModule } from './restaurant.module';

@Module({
  imports:[
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'foodapp',
      password: process.env.DB_PASS || 'foodapp',
      database: process.env.DB_NAME || 'foodapp',
      entities:[Restaurant, MenuItem],
      synchronize: true
    }),
    ClientsModule.register([{ name: 'NATS_EMITTER', transport: Transport.NATS, options: { servers: [process.env.NATS_URL || 'nats://localhost:4222'] } }]),
    RestaurantModule
  ]
})
export class AppModule {}
