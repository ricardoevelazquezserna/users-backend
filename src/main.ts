import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { VALIDATION_PIPE_OPTIONS } from './shared/constants';
import { HttpExceptionFilter, MongoExceptionFilter } from './shared/filters';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.useGlobalFilters(new HttpExceptionFilter(), new MongoExceptionFilter());

  const { PORT = 8080 } = process.env;

  await app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

bootstrap();
