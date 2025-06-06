import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule và ConfigService
import { User } from '@app/common/entities/auth/user.entity';
import { UserDetail } from '@app/common/entities/auth/user-detail.entity';
import { AuthService } from './auth.service';
import { UserService } from './users/user.service';
import { AdminService } from './admin/admin.service';
import { UserDetailService } from './user-details/user-detail.service';
import { JwtStrategy } from './stategies/jwt.stategy';
import { AuthController } from './auth.controller';
import { Admin } from '@app/common/entities/auth/admin.entity';
import { DiscordLogService } from '@app/modules/discord-notify/log-discord.service';
import { LoggerService } from '@app/common/services/logger.service';
import { AuthMailProducer } from '@app/modules/mailer/auth/auth-mailer.producer';
import { AuthMailModule } from '@app/modules/mailer/auth/auth-mailer.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Admin, UserDetail]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    AuthMailModule,
  ],
  providers: [
    AuthService,
    UserService,
    AdminService,
    UserDetailService,
    JwtStrategy,
    DiscordLogService,
    LoggerService,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtModule,
    PassportModule,
    UserService,
    AdminService,
    UserDetailService,
  ],
})
export class AuthModule {}
