import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { join } from "path";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

const bootstrap = async () => {
  // Create an application context to access ConfigService
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const grpcUrl = configService.get<string>("USER_GRPC_URL", "0.0.0.0:50055");

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: grpcUrl,
        package: "user.v1",
        protoPath: join(__dirname, "../../..", "packages/proto/user.proto"),
      },
    }
  );

  await app.listen();
  Logger.log(`User Service listening on ${grpcUrl.split(":")[1] || 50055}`);
};

bootstrap();
