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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResendTokenDto } from './dto/resend-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';

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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: LoginDto) {
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
  async verifyEmail(@Param('token') verificationToken: string) {
    await this.authService.verifyEmail(verificationToken);
    return {
      message:
        'Xác minh email thành công. Tài khoản của bạn đã được kích hoạt.',
    };
  }

  @Post('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('token') verificationToken: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    await this.authService.resetPassword(
      verificationToken,
      resetPasswordDto.password,
    );
    return {
      message: 'Thay đổi mật khẩu thành công.',
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const token = await this.authService.forgotPassword(
      forgotPasswordDto.emailUser,
    );
    return {
      message: 'Vui lòng kiểm tra email.',
      data: {
        token: token,
      },
    };
  }

  @Post('resend-token')
  @HttpCode(HttpStatus.OK)
  async resendToken(@Body() resendTokenDto: ResendTokenDto) {
    const token = await this.authService.resendVerificationEmail(
      resendTokenDto.emailUser,
    );
    return {
      message: 'Vui lòng kiểm tra email.',
      data: {
        token: token,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: Request) {
    // <-- Sửa kiểu từ Express.User thành Request
    // Đảm bảo req.user tồn tại (JwtAuthGuard sẽ làm điều này)
    // Mặc dù JwtAuthGuard đảm bảo có req.user, nhưng kiểm tra null/undefined vẫn là tốt practice.
    if (!req.user) {
      // <-- Truy cập req.user
      throw new UnauthorizedException('Thông tin người dùng không hợp lệ.');
    }

    // Truy cập req.user.uuid
    const { userDetail, ...user } = await this.authService.getProfile(
      req.user.uuid, // <-- Truy cập req.user.uuid ở đây
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
