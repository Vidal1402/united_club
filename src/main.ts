import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', '*').split(','),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  try {
    const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
    const swagger = new DocumentBuilder()
      .setTitle('United Club API')
      .setDescription('Plataforma de Afiliados Gamificada - Fintech')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('api/docs', app, document);
    console.log('Swagger: /api/docs');
  } catch (e) {
    console.warn('Swagger não carregado (API segue funcionando):', (e as Error).message);
  }

  const port = Number(process.env.PORT) || config.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`United Club API listening on port ${port}`);
}
bootstrap();
