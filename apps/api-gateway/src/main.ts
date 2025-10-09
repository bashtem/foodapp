import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe } from "@nestjs/common";
// import { Logger } from 'nestjs-pino';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // app.useLogger(app.get(Logger));

  // Use ConfigService to get the port
  const configService = app.get(ConfigService);

  const port = parseInt(
    configService.get<string>("API_GATEWAY_PORT", "3000"),
    10
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(port);
  Logger.log(`API Gateway listening on port ${port}`);
};

bootstrap();
