import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "./user.module";
import { User } from "./entities/user.entity";
import { Environment } from "@foodapp/utils/src/environment.enum";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || Environment.Development}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>("USER_DB_HOST", "mysql_user"),
        port: +config.get<string>("USER_DB_PORT", "3307"),
        username: config.get<string>("USER_DB_USER", "foodapp"),
        password: config.get<string>("USER_DB_PASS", "foodapp"),
        database: config.get<string>("USER_DB_NAME", "foodapp"),
        entities: [User],
      }),
    }),
    UserModule,
  ],
})
export class AppModule {}
