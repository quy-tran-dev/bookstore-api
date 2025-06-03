import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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

  // Bạn có thể thêm các endpoint khác như:
  // @Post('forgot-password')
  // @Post('reset-password')
  // @Get('profile') // Cần dùng Guard và Decorator để lấy thông tin người dùng từ JWT
}
