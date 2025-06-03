import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const AppDataSource = (configService: ConfigService) =>
  new DataSource({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASS'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    synchronize: configService.get('NODE_ENV') === 'dev',
  });

// npm run migration:generate -- src/database/migrations/CreateUsersTable -d src/database/data-source.ts
