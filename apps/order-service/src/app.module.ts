import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";
import { OrderModule } from "./order.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Environment } from "@foodapp/utils/src/enums";

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
        host: config.get<string>("ORDER_DB_HOST", "localhost"),
        port: +config.get<string>("ORDER_DB_PORT", "5433"),
        username: config.get<string>("ORDER_DB_USER", "foodapp"),
        password: config.get<string>("ORDER_DB_PASS", "foodapp"),
        database: config.get<string>("ORDER_DB_NAME", "foodapp"),
        autoLoadEntities: true,
        synchronize: true,
        logging: ["error", "warn", "schema"],
      }),
    }),

    OrderModule,
  ],
})
export class AppModule {}
