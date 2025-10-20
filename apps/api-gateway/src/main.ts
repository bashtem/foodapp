import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  const port = parseInt(
    configService.get<string>("API_GATEWAY_PORT", "3000"),
    10
  );

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );
  app.setGlobalPrefix("api/v1");
  await app.listen(port);
  const logger = app.get(Logger);
  logger.log(`API Gateway listening on port ${port}`);
};

bootstrap();
