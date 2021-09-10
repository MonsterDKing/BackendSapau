import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  // app.useGlobalFilters(new TypeORMExceptionFilter());
  const PORT = process.env.PORT || 3000;

  const options = new DocumentBuilder()
    .setTitle(' Api Rest')
    .setDescription(' Api Rest')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
}
bootstrap();