import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthGrpcController } from "./auth.grpc";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import path, { join } from "path";
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

    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn:
            parseInt(configService.get<string>("JWT_EXPIRATION") as string) ||
            "1h",
        },
      }),
    }),

    ClientsModule.register([
      {
        name: "USER_GRPC",
        transport: Transport.GRPC,
        options: {
          url: process.env.USER_GRPC_ADDR || "user-service:50055",
          package: "user.v1",
          protoPath: join(__dirname, "../../..", "packages/proto/user.proto"),
        },
      },
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthGrpcController],
})
export class AppModule {}
