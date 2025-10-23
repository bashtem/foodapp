import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle("FoodApp API Gateway")
    .setDescription("The FoodApp API Gateway description")
    .setVersion("1.0")
    .addTag("foodapp")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  const configService = app.get(ConfigService);
  const port = parseInt(configService.get<string>("API_GATEWAY_PORT", "3000"), 10);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.setGlobalPrefix("api/v1");
  SwaggerModule.setup("docs", app, documentFactory, { useGlobalPrefix: true });

  await app.listen(port);
  const logger = app.get(Logger);
  logger.log(`API Gateway listening on port ${port}`);
};

bootstrap();
