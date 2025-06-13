import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (err || !user) {
      if (info && info.message === 'No auth token') {
        throw new UnauthorizedException('Authorization token not provided.');
      }
      // Ném ra UnauthorizedException với thông báo tùy chỉnh
      throw err || new UnauthorizedException('Bạn không được phép truy cập tài nguyên này.');
    }
    return user; // Trả về user để NestJS gắn vào req.user
  }
}