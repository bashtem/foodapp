import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { ClientsModule, Transport } from "@nestjs/microservices";
import path, { join } from "path";
import { AuthController } from "./auth/auth.controller";
import { RestaurantsController } from "./restaurants/restaurants.controller";
import { PaymentsController } from "./payments/payments.controller";
import { OrdersController } from "./orders/orders.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Environment } from "@foodapp/utils/src/environment.enum";
import { UsersController } from "./users/users.controller";

@Module({
  imports: [
    // LoggerModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(
        __dirname,
        `../.env.${process.env.NODE_ENV?.trim() || Environment.Development}`
      ),
    }),
    ClientsModule.registerAsync([
      {
        name: "ORDER_GRPC",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>("ORDER_GRPC_URL", "localhost:50051"),
            package: "order.v1",
            protoPath: join(
              __dirname,
              "../../..",
              "packages/proto/order.proto"
            ),
          },
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
            protoPath: join(
              __dirname,
              "../../..",
              "packages/proto/restaurant.proto"
            ),
          },
        }),
      },
      {
        name: "PAYMENT_GRPC",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>("PAYMENT_GRPC_URL", "localhost:50053"),
            package: "payment.v1",
            protoPath: join(
              __dirname,
              "../../..",
              "packages/proto/payment.proto"
            ),
            loader: { keepCase: true },
          },
        }),
      },
      {
        name: "AUTH_GRPC",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>("AUTH_GRPC_URL", "localhost:50054"),
            package: "auth.v1",
            protoPath: join(__dirname, "../../..", "packages/proto/auth.proto"),
            loader: { keepCase: true },
          },
        }),
      },
      {
        name: "USER_GRPC",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>("USER_GRPC_URL", "localhost:50055"),
            package: "user.v1",
            protoPath: join(__dirname, "../../..", "packages/proto/user.proto"),
            loader: { keepCase: true },
          },
        }),
      },
    ]),
  ],
  controllers: [
    OrdersController,
    RestaurantsController,
    PaymentsController,
    AuthController,
    UsersController,
  ],
})
export class AppModule {}
