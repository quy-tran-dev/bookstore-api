import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtAuthGuard } from '@app/common/guards/auth.guard';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { UserService } from '../users/user.service';
import { AdminGuard } from '@app/common/guards/admin.guard';
import { Roles } from '@app/common/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles(0)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('Vui lòng đăng nhập.');
    }
    const data = await this.adminService.findByAccount(req.user.email);
     
    return {
      message: 'Lấy thông tin người dùng thành công.',
      data: data,
    };
  }
}