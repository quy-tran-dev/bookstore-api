import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '@app/common/guards/auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const { user, accessToken } =
      await this.authService.registerUser(registerDto);
    return {
      message:
        'Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản.',
      data: {
        user: {
          userId: user.uuid,
          nameUser: user.nameUser,
          emailUser: user.emailUser,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        accessToken: accessToken,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Trả về mã 200 OK khi đăng nhập thành công
  async login(@Body() loginDto: LoginDto) {
    const { user, accessToken } = await this.authService.loginUser(loginDto);
    return {
      message: 'Đăng nhập thành công.',
      data: {
        user: {
          userId: user.uuid,
          nameUser: user.nameUser,
          emailUser: user.emailUser,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        accessToken: accessToken,
      },
    };
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK) // Trả về mã 200 OK khi đăng nhập admin thành công
  async adminLogin(@Body() loginDto: LoginDto) {
    // Có thể dùng AdminLoginDto riêng nếu cần
    const { admin, accessToken } = await this.authService.loginAdmin(loginDto);
    return {
      message: 'Đăng nhập admin thành công.',
      data: {
        admin: {
          adminId: admin.uuid,
          nameAdmin: admin.nameAdmin,
          account: admin.account,
          power: admin.power,
        },
        accessToken: accessToken,
      },
    };
  }

  @Get('verify-email/:token')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Param('token') token: string) {
    await this.authService.verifyEmail(token);
    return {
      message:
        'Xác minh email thành công. Tài khoản của bạn đã được kích hoạt.',
    };
  }

 
  @Post('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Param('token') token: string, @Body() password: string) {
    await this.authService.resetPassword(token, password);
    return {
      message:
        'Thay đổi mật khẩu thành công.',
    };
  }


  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() email: string) {
    await this.authService.forgotPassword(email);
    return {
      message:
        'Vui lòng kiểm tra email.',
    };
  }

   @Post('resend-token')
  @HttpCode(HttpStatus.OK)
  async resendToken(@Body() email: string) {
    await this.authService.resendVerificationEmail(email);
    return {
      message:
        'Vui lòng kiểm tra email.',
    };
  }

  @UseGuards(JwtAuthGuard) // Áp dụng JwtAuthGuard cho route này
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('Vui lòng đăng nhập.');
    }
    const { userDetail, ...user } = await this.authService.getProfile(
      req.user.uuid,
    );
    return {
      message: 'Lấy thông tin người dùng thành công.',
      data: {
        user: {
          ...user,
          userDetail: {
            ...userDetail,
          },
        },
      },
    };
  }
}
