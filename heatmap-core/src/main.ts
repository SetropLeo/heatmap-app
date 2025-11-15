import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(express.json({ limit: '10mb' }));
  app.use(express.text({ type: '*/*' }));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
