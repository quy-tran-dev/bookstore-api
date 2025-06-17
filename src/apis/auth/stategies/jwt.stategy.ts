import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { UserService } from '../users/user.service';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy JWT từ header Authorization: Bearer <token>
      ignoreExpiration: false, // Không bỏ qua thời gian hết hạn của token
      secretOrKey: configService.get<string>('JWT_SECRET'), // Lấy secret key từ biến môi trường
    });
  }

  /**
   * Phương thức validate được gọi sau khi JWT được giải mã thành công.
   * @param payload Payload đã giải mã từ JWT.
   * @returns Đối tượng người dùng đã được xác thực.
   */
  async validate(payload: JwtPayload): Promise<any> {
    if (typeof payload.role === 'number' && payload.role >= 0) {
      // Đây là Admin
      const admin = await this.adminService.findOne({ uuid: payload.userId });
      if (!admin) {
        throw new UnauthorizedException('Admin không tìm thấy.');
      }
      // Trả về đối tượng Admin với các trường của Express.User
      return {
        uuid: admin.uuid,
        email: admin.account, // account của admin
        role: admin.power,
        nameAdmin: admin.nameAdmin,
        isLogin: admin.isLogin,
        cancelRole: admin.cancelRole,
      };
    } else {
      // Đây là User thông thường (role = -1)
      const user = await this.userService.findOne({ uuid: payload.userId });
      if (!user) {
        throw new UnauthorizedException('Người dùng không tìm thấy.');
      }
      return {
        uuid: user.uuid,
        email: user.emailUser,
        role: -1,
        isVerified: user.isVerified,
      };
    }
  }
}
