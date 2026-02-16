import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import type { Request, Response, NextFunction } from 'express';

function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const raw = process.env.CORS_ORIGIN ?? '*';
  const origins = raw.split(',').map((o) => o.trim()).filter(Boolean);
  const allowAny = origins.length === 0 || origins.every((o) => o === '*');
  const requestOrigin = req.headers.origin;
  const origin = allowAny ? requestOrigin : (requestOrigin && origins.includes(requestOrigin) ? requestOrigin : undefined);
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
}

async function bootstrap() {
  console.log('[Render] Bootstrap iniciando... PORT=', process.env.PORT);

  const app = await NestFactory.create(AppModule);
  app.use(corsMiddleware);

  const config = app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const corsOrigin = config.get<string>('CORS_ORIGIN', '*');
  const origins = corsOrigin.split(',').map((o) => o.trim()).filter(Boolean);
  const allowOrigin =
    origins.length && !origins.every((o) => o === '*')
      ? origins
      : true;
  app.enableCors({
    origin: allowOrigin,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swagger = new DocumentBuilder()
    .setTitle('United Club API')
    .setDescription('Plataforma de Afiliados Gamificada - Fintech')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api/docs', app, document);

  // Render exige que a app escute em process.env.PORT (ex.: 10000)
  const port = Number(process.env.PORT) || 10000;
  if (!Number.isInteger(port) || port < 1) {
    throw new Error(`PORT inválido: ${process.env.PORT}`);
  }
  console.log('[Render] Abrindo porta', port, 'em 0.0.0.0...');
  await app.listen(port, '0.0.0.0');
  console.log(`United Club API listening on port ${port}`);
  console.log(`Swagger: /api/docs`);
}

bootstrap().catch((err) => {
  console.error('Falha ao subir a API:', err);
  process.exit(1);
});
