// src/seed.ts (hoặc src/database/seed.ts)
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module'; // Điều chỉnh đường dẫn đến AppModule của bạn
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { seeders } from './seeders';

async function bootstrap() {
  const logger = new Logger('Seeder');
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource); // Lấy DataSource từ DI container của NestJS

    logger.log('Running database seeders...');
    for (const seeder of seeders) {
      logger.log(`Running seeder: ${seeder.constructor.name}`);
      await seeder.run(dataSource);
    }
    logger.log('All seeders finished successfully!');

    await app.close(); // Đóng ứng dụng NestJS
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed!', error.stack);
    process.exit(1);
  }
}

bootstrap();