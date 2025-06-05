import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './dto/jwt-payload.dto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { UserService } from './users/user.service';
import { AdminService } from './admin/admin.service';
import { User } from '@app/common/entities/auth/user.entity';
import { Admin } from '@app/common/entities/auth/admin.entity';
import { log } from 'console';
import { LoggerService } from '@app/common/services/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  /**
   * Đăng ký người dùng mới.
   * @param registerDto DTO chứa thông tin đăng ký.
   * @returns Đối tượng User đã đăng ký và token JWT.
   */
  async registerUser(
    registerDto: RegisterDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { passwordUser, recipientName, addressUser, phoneUser, ...userData } =
      registerDto;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userService.findByEmail(userData.emailUser);
    if (existingUser) {
      throw new BadRequestException('Email đã được đăng ký.');
    }

    const hashedPassword = await bcrypt.hash(passwordUser, 10);

    // Tạo verification token
    const verificationToken = uuidv4();

    // Tạo người dùng mới
    const newUser = await this.userService.createUser({
      ...userData,
      passwordUser: hashedPassword,
      isVerified: false,
      verificationToken: verificationToken,
    });

    // Tạo user detail nếu có thông tin
    if (recipientName || addressUser || phoneUser) {
      await this.userService.createOrUpdateUserDetail(newUser.uuid, {
        recipientName,
        addressUser,
        phoneUser,
        userId: newUser.uuid, // Đảm bảo userId được gán
      });
    }

    // Tạo JWT token
    const accessToken = await this.generateUserToken(newUser);

    // Lưu ý: Trong một ứng dụng thực tế, bạn sẽ gửi email xác minh tại đây
    // Ví dụ: await this.emailService.sendVerificationEmail(newUser.emailUser, verificationToken);

    return { user: newUser, accessToken };
  }

  /**
   * Đăng nhập người dùng.
   * @param loginDto DTO chứa thông tin đăng nhập.
   * @returns Đối tượng User đã đăng nhập và token JWT.
   */
  async loginUser(
    loginDto: LoginDto,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.userService.findByEmail(loginDto.emailUser);
    const checkPassword = await bcrypt.compare(
      loginDto.passwordUser,
      user!.passwordUser,
    );
    this.loggerService.logDebug('login', 'loginDto', loginDto);
    this.loggerService.logDebug(
      'login',
      'hashedPassword from DB',
      user!.passwordUser,
    ); 
    this.loggerService.logDebug('login', 'compare result', checkPassword);
    if (!user || !checkPassword) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ.');
    }

    // Kiểm tra nếu tài khoản chưa được xác minh (tùy chọn)
    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email.',
      );
    }

    const accessToken = await this.generateUserToken(user);
    return { user, accessToken };
  }

  /**
   * Đăng nhập admin.
   * @param loginDto DTO chứa thông tin đăng nhập (sử dụng lại LoginDto cho đơn giản, hoặc tạo AdminLoginDto riêng).
   * @returns Đối tượng Admin đã đăng nhập và token JWT.
   */
  async loginAdmin(
    loginDto: LoginDto,
  ): Promise<{ admin: Admin; accessToken: string }> {
    const admin = await this.adminService.findByAccount(loginDto.emailUser); // Sử dụng emailUser làm account cho admin login

    if (
      !admin ||
      !(await bcrypt.compare(loginDto.passwordUser, admin.password))
    ) {
      throw new UnauthorizedException(
        'Thông tin đăng nhập admin không hợp lệ.',
      );
    }

    const accessToken = await this.generateAdminToken(admin);

    // Cập nhật trạng thái isLogin của admin (tùy chọn)
    await this.adminService.updateAdmin(admin.uuid, { isLogin: true });

    return { admin, accessToken };
  }

  /**
   * Tạo JWT token cho người dùng.
   * @param user Đối tượng User.
   * @returns Chuỗi JWT token.
   */
  private async generateUserToken(user: User): Promise<string> {
    const payload: JwtPayload = { userId: user.uuid, email: user.emailUser };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'), // Lấy secret từ ConfigService
      expiresIn: '1h', // Thời gian hết hạn của token
    });
  }

  /**
   * Tạo JWT token cho admin.
   * @param admin Đối tượng Admin.
   * @returns Chuỗi JWT token.
   */
  private async generateAdminToken(admin: Admin): Promise<string> {
    const payload: JwtPayload = {
      userId: admin.uuid,
      email: admin.account,
      role: admin.power,
    }; // Sử dụng adminId và account
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'), // Lấy secret từ ConfigService
      expiresIn: '1h', // Thời gian hết hạn của token
    });
  }

  /**
   * Xác minh email người dùng.
   * @param verificationToken Token xác minh.
   * @returns Đối tượng User đã được xác minh.
   */
  async verifyEmail(verificationToken: string): Promise<User> {
    const user = await this.userService.findOne({
      verificationToken: verificationToken,
    });

    if (!user) {
      throw new BadRequestException(
        'Token xác minh không hợp lệ hoặc đã hết hạn.',
      );
    }

    if (user.isVerified) {
      throw new BadRequestException('Tài khoản đã được xác minh trước đó.');
    }

    return this.userService.markUserAsVerified(user.uuid);
  }
}
