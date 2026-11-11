import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // السماح بالوصول من الواجهات المحلية
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3005'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // بادئة جميع مسارات API
  app.setGlobalPrefix('api');

  // التحقق من البيانات
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // الملفات الثابتة
  const publicPath = join(process.cwd(), 'public');

  console.log('Public path:', publicPath);
  console.log('Public folder exists:', existsSync(publicPath));

  app.useStaticAssets(publicPath, {
    prefix: '/',
  });

  const port = process.env.PORT ?? 3005;

  await app.listen(port);

  console.log(`Server running: http://localhost:${port}`);
  console.log(`API base URL: http://localhost:${port}/api`);
}

bootstrap();
