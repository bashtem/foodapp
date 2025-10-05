import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { join } from "path";
import { ConfigService } from "@nestjs/config";
import { logger } from "@foodapp/utils/src/logger";

(async () => {
  // Create an application context to access ConfigService
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const grpcUrl = configService.get<string>(
    "RESTAURANT_GRPC_URL",
    "0.0.0.0:50052"
  );

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: grpcUrl,
        package: "restaurant.v1",
        protoPath: join(
          __dirname,
          "../../..",
          "packages/proto/restaurant.proto"
        ),
      },
    }
  );
  await app.listen();
  logger.log(`Restaurant Service listening on ${grpcUrl}`);
})();
