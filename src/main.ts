import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  // app.useGlobalFilters(new TypeORMExceptionFilter());
  
  const options = new DocumentBuilder()
    .setTitle('Deudas Api Rest')
    .setDescription('Deudas Api Rest')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(80);
}
bootstrap();