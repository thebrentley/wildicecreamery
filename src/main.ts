import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
const PORT = 3000;
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  console.log(`Started on at http://localhost:${PORT}`);
}
bootstrap();
