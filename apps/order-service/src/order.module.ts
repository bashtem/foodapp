import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { Order } from "./entities/order.entity";
import { Cart } from "./entities/cart.entity";
import { CartItem } from "./entities/cart_item.entity";
import { OrderService } from "./order.service";
import { OrderGrpcController } from "./order.grpc";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServiceNatsEnum } from "@foodapp/utils/src/enums";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Cart, CartItem]),
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
        name: "RESTAURANT_GRPC",
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
      {
        name: "REDIS",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: config.get<string>("REDIS_HOST", "localhost"),
            port: +config.get<string>("REDIS_PORT", "6379"),
          },
        }),
      },
    ]),
  ],
  providers: [OrderService],
  controllers: [OrderGrpcController],
})
export class OrderModule {}
