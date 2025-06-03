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


@Module({
  imports: [
    ConfigModule, // Đảm bảo ConfigModule được import để sử dụng ConfigService
    TypeOrmModule.forFeature([User, Admin, UserDetail]), // Đăng ký các Entities
    PassportModule.register({ defaultStrategy: 'jwt' }), // Cấu hình Passport sử dụng JWT mặc định
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule vào đây để JwtModule có thể sử dụng ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Lấy JWT_SECRET từ biến môi trường
        signOptions: { expiresIn: '1h' }, // Thời gian hết hạn mặc định cho token
      }),
      inject: [ConfigService], // Tiêm ConfigService vào useFactory
    }),
  ],
  providers: [
    AuthService,
    UserService,
    AdminService,
    UserDetailService, 
    JwtStrategy,
    DiscordLogService
  ],
 controllers: [AuthController],
  exports: [AuthService, JwtModule, PassportModule, UserService, AdminService, UserDetailService], // Export các service và module cần thiết cho các module khác
})
export class AuthModule {}
