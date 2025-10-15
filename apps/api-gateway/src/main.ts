import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
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
  // app.connectMicroservice<MicroserviceOptions>({transport: Transport.GRPC, options: {
  //   url: configService.get<string>("AUTH_GRPC_URL", "localhost:50054"),
  //   package: "auth.v1",
  //   protoPath: "packages/proto/auth.proto",
  // }});
  
  // app.connectMicroservice<MicroserviceOptions>({transport: Transport.GRPC, options: {
  //   url: configService.get<string>("USER_GRPC_URL", "localhost:50055"),
  //   package: "user.v1",
  //   protoPath: "packages/proto/user.proto",
  // }});

  // await app.startAllMicroservices();
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.setGlobalPrefix("api/v1");
  await app.listen(port);
  Logger.log(`API Gateway listening on port ${port}`);
};

bootstrap();
