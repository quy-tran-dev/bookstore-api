
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class VerifiedUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as Express.User;

    if (!user || !user.isVerified) {
      throw new ForbiddenException('Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email hoặc đến trang cá nhân để xác minh tài khoản và truy cập chức năng này.');
    }
    return true;
  }
}