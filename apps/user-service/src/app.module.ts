import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "./user.module";
import { Environment } from "@foodapp/utils/src/enums";
import path from "path";

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
        type: "mysql",
        host: config.get<string>("USER_DB_HOST", "localhost"),
        port: +config.get<string>("USER_DB_PORT", "3307"),
        username: config.get<string>("USER_DB_USER", "foodapp"),
        password: config.get<string>("USER_DB_PASS", "foodapp"),
        database: config.get<string>("USER_DB_NAME", "foodapp"),
        autoLoadEntities: true,
        synchronize: true,        
      }),
    }),
    UserModule,
  ],
})
export class AppModule {}
