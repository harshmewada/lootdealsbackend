import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
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
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
