import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthGrpcController } from "./auth.grpc";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { Environment } from "@foodapp/utils/src/environment.enum";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || Environment.Development}`,
    }),
    JwtModule.register({ secret: process.env.JWT_SECRET || "devsecret" }),
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
