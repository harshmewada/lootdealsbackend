import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { AppClusterService } from './app-cluster.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Loot Deals ')
    .setDescription('Loot Deals API description')
    .setVersion('2.0')
    .addSecurity('ApiTokenAuth', {
      type: 'http',
      in: 'header',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
    })
    .addSecurityRequirements('ApiTokenAuth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.enableShutdownHooks();
  // app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());

  const isProduction = process.env.NODE_ENV === 'production';

  // Set log levels in production
  if (isProduction) {
    Logger.log('Running in production mode');
    app.useLogger(['error', 'warn']); // Only log errors and warnings in production
  } else {
    app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']); // Full logs in non-production
  }
  await app.listen(3000);
}
AppClusterService.clusterize(bootstrap);
