import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
console.log(' NODE_ENV =', process.env.NODE_ENV);
console.log(' MONGO_PROD =', process.env.MONGO_PROD);
