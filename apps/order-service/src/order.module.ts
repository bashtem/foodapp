import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { Order } from "./entities/order.entity";
import { Cart } from "./entities/cart.entity";
import { OrderService } from "./order.service";
import { CartService } from "./cart.service";
import { OrderGrpcController } from "./order.grpc";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServiceGrpcEnum, ServiceNatsEnum } from "@foodapp/utils/src/enums";
import { CartGrpcController } from "./cart.grpc";
import { CacheModule } from "@nestjs/cache-manager";
import KeyvRedis from "@keyv/redis";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Cart]),
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: ServiceNatsEnum.ORDER_NATS,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.NATS,
          options: { servers: [config.get<string>("ORDER_NATS_URL", "nats://localhost:4222")] },
        }),
      },
      {
        name: ServiceGrpcEnum.RESTAURANT_GRPC,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>("RESTAURANT_GRPC_URL", "localhost:50052"),
            package: "restaurant.v1",
            protoPath: join(__dirname, "../../..", "packages/proto/restaurant.proto"),
          },
        }),
      },
    ]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>("TTL_CACHE_MS", 86400000), // 1 day
        stores: [new KeyvRedis(configService.get<string>("REDIS_URL", "redis://localhost:6379"))],
      }),
    }),
  ],
  providers: [OrderService, CartService],
  controllers: [OrderGrpcController, CartGrpcController],
})
export class OrderModule {}
