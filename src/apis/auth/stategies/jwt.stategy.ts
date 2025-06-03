import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@app/common/entities/auth/user.entity';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { UserService } from '../users/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
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
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOne({ uuid: payload.userId }); // Tìm người dùng bằng userId từ payload

    if (!user) {
      throw new UnauthorizedException(
        'Người dùng không tồn tại hoặc token không hợp lệ.',
      );
    }
    // Bạn có thể thêm kiểm tra quyền hạn ở đây nếu cần
    // if (!user.isVerified) {
    //   throw new UnauthorizedException('Tài khoản chưa được xác minh.');
    // }

    // Trả về đối tượng user, nó sẽ được gắn vào req.user trong các route được bảo vệ
    return user;
  }
}
