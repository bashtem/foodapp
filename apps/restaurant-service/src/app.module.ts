import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";
import { RestaurantModule } from "./restaurant.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Environment } from "@foodapp/utils/src/enums/environment.enum";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(
        __dirname,
        `../.env.${process.env.NODE_ENV?.trim() || Environment.Development}`
      ),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("RESTAURANT_DB_HOST", "localhost"),
        port: +config.get<string>("RESTAURANT_DB_PORT", "5432"),
        username: config.get<string>("RESTAURANT_DB_USER", "foodapp"),
        password: config.get<string>("RESTAURANT_DB_PASS", "foodapp"),
        database: config.get<string>("RESTAURANT_DB_NAME", "foodapp"),
        autoLoadEntities: true,
        synchronize: true,
        logging: ["error", "warn", "schema"],
      }),
    }),

    RestaurantModule,
  ],
})
export class AppModule {}
