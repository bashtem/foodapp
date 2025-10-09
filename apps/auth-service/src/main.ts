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

  const grpcUrl = configService.get<string>("AUTH_GRPC_URL", "0.0.0.0:50054");

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: grpcUrl,
        package: "auth.v1",
        protoPath: join(__dirname, "../../..", "packages/proto/auth.proto"),
      },
    }
  );
  await app.listen();
  Logger.log(`Auth Service listening on ${grpcUrl.split(":")[1] || 50054}`);
};

bootstrap();
