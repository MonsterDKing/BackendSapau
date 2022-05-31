import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { TypeORMExceptionFilter } from './filters/typeorm-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new TypeORMExceptionFilter());
  app.enableCors();
  const PORT = process.env.PORT || 8080;
  const options = new DocumentBuilder()
    .setTitle(' Api Rest')
    .setDescription(' Api Rest')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
}
bootstrap();