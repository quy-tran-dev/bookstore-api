import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule và ConfigService
import { User } from '@app/common/entities/auth/user.entity';
import { UserDetail } from '@app/common/entities/auth/user-detail.entity';
import { Admin } from '@app/common/entities/auth/admin.entity';
import { DiscordLogService } from '@app/modules/discord-notify/log-discord.service';
import { LoggerService } from '@app/common/services/logger.service';
import { AuthMailProducer } from '@app/modules/mailer/auth/auth-mailer.producer';
import { AuthMailModule } from '@app/modules/mailer/auth/auth-mailer.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserService } from '../users/user.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Admin, UserDetail]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('EXP_DEFAULT') },
      }),
      inject: [ConfigService],
    }),
    AuthMailModule,
  ],
  providers: [
    DiscordLogService,
    LoggerService,
    AdminService,
    UserService,
  ],
  controllers: [AdminController],
  exports: [
    JwtModule,
    PassportModule,
  ],
})
export class AdminModule {}
