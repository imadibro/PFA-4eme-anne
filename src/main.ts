import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const ALLOWED_ORIGINS = [
	'http://localhost:3000',
];

async function bootstrap() {
  	const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization', 'cookie'],
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  	const config: ConfigService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  const port:number = config.get<number>('PORT') || 3000;
  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}
bootstrap();
