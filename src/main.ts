import { NestFactory } from "@nestjs/core"; 
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./api/app.module";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}

bootstrap()