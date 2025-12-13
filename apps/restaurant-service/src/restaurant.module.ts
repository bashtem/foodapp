import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { MenuItem } from "./entities/menu_item.entity";
import { RestaurantService } from "./restaurant.service";
import { RestaurantGrpcController } from "./restaurant.grpc";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ServiceNatsEnum } from "@foodapp/utils/src/enums";
@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, MenuItem]),
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: ServiceNatsEnum.RESTAURANT_NATS,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [config.get<string>("RESTAURANT_NATS_URL", "nats://localhost:4222")],
          },
        }),
      },
    ]),
  ],
  providers: [RestaurantService],
  controllers: [RestaurantGrpcController],
})
export class RestaurantModule {}
