import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  console.log('Server started in port ', process.env.PORT);
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.raw({ limit: '50mb' }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  await app.listen(process.env.PORT);
}

bootstrap();
