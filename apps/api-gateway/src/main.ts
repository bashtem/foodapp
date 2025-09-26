import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from '@foodapp/utils/src/logger';
async function bootstrap(){
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
  logger.log(`API Gateway listening on ${process.env.PORT || 3000}`);
}
bootstrap();
