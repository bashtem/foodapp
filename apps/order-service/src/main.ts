import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { join } from "path";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

(async () => {
  // Create an application context to access ConfigService
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const grpcUrl = configService.get<string>("ORDER_GRPC_URL", "0.0.0.0:50051");

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: grpcUrl,
      package: "order.v1",
      protoPath: join(__dirname, "../../..", "packages/proto/order.proto"),
    },
  });
  await app.listen();
  Logger.log(`Order Service listening on ${grpcUrl.split(":")[1] || 50051}`, "OrderService");
})();
