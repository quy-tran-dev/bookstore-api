import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import { useSwagger } from './app.swagger';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<string>('PORT') || 3000;
  const nodeEnv = configService.get<string>('NODE_ENV');

  // Config global
  app.setGlobalPrefix('apis');

  app.use(helmet());

  app.use(compression());

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  useSwagger(app);

  await app.listen(port).then(async () => {
    const url = await app.getUrl();
    //   try {
    //   const authQueue = app.get<Queue>(getQueueToken('authQueue'));
    //   const client = authQueue.client; // Lấy client của Redis (ioredis instance)

    //   // Kiểm tra trạng thái của client. 'ready' nghĩa là đã kết nối và sẵn sàng sử dụng.
    //   // 'connect' là trạng thái đang kết nối, 'end' là đã đóng.
    //   if (client && client.status === 'ready') {
    //     Logger.log('Redis Bull Queue connected successfully (status: ready)!', 'BullCheck');
    //     // Thử PING Redis (tùy chọn, để xác nhận thêm)
    //     await client.ping();
    //     Logger.log('Redis PING successful!', 'BullCheck');
    //   } else {
    //     Logger.error(`Redis Bull Queue connection FAILED or not ready (status: ${client ? client.status : 'undefined'})!`, 'BullCheck');
    //     // Nếu bạn muốn log chi tiết hơn về lỗi kết nối
    //     client.on('error', (err) => {
    //       Logger.error(`Redis client error: ${err.message}`, err.stack, 'BullCheck');
    //     });
    //   }
    // } catch (e) {
    //   Logger.error(`Error during Redis Bull Queue check: ${e.message}`, e.stack, 'BullCheck');
    // }
    logger.debug(`Your app is running on port ${port}`);
    logger.debug(`Environment: ${nodeEnv}`);
    logger.debug(`Documentation ${url}/docs`);
  });
}
bootstrap();
