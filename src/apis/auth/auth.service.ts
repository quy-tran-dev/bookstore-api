import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
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

import { LoggerService } from '@app/common/services/logger.service';
import { AuthMailProducer } from '@app/modules/mailer/auth/auth-mailer.producer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly authMailProducer: AuthMailProducer,
  ) {}

  async registerUser(
    registerDto: RegisterDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { passwordUser, recipientName, addressUser, phoneUser, ...userData } =
      registerDto;

    const existingUser = await this.userService.findByEmail(userData.emailUser);
    if (existingUser) {
      throw new BadRequestException('Email đã được đăng ký.');
    }

    const hashedPassword = await bcrypt.hash(passwordUser, 10);

    // Tạo verification token
    
    // Tạo người dùng mới
    const newUser = await this.userService.createUser({
      ...userData,
      passwordUser: hashedPassword,
      isVerified: false,
      verificationToken: '',
    });
    const verificationToken = await this.generateUserToken(newUser);


    // Tạo user detail nếu có thông tin
    if (recipientName || addressUser || phoneUser) {
      await this.userService.createOrUpdateUserDetail(newUser.uuid, {
        recipientName,
        addressUser,
        phoneUser,
        userId: newUser.uuid,
      });
    }

    const accessToken = await this.generateUserToken(newUser);

    this.supportSendEmail(
      'welcome',
      newUser.emailUser,
      newUser.nameUser,
      verificationToken,
    );

    return { user: newUser, accessToken };
  }

  async loginUser(
    loginDto: LoginDto,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.userService.findByEmail(loginDto.emailUser);

    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ.');
    }

    const checkPassword = await bcrypt.compare(
      loginDto.passwordUser,
      user.passwordUser,
    );

    if (!checkPassword) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ.');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email.',
      );
    }

    const accessToken = await this.generateUserToken(user);
    return { user, accessToken };
  }

  async loginAdmin(
    loginDto: LoginDto,
  ): Promise<{ admin: Admin; accessToken: string }> {
    const admin = await this.adminService.findByAccount(loginDto.emailUser);

    if (!admin) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ.');
    }

    if (!(await bcrypt.compare(loginDto.passwordUser, admin.password))) {
      throw new UnauthorizedException(
        'Thông tin đăng nhập admin không hợp lệ.',
      );
    }

    const accessToken = await this.generateAdminToken(admin);

    // Cập nhật trạng thái isLogin của admin (tùy chọn)
    await this.adminService.updateAdmin(admin.uuid, { isLogin: true });

    return { admin, accessToken };
  }

  private async generateUserToken(
    user: User,
    action?: string,
  ): Promise<string> {
    const payload: JwtPayload = {
      userId: user.uuid,
      email: user.emailUser,
      role: -1,
    };

    let exp: string = '';
    switch (action) {
      case 'forgot':
        exp = this.configService.get<string>('EXP_RESETPASSWORD') ?? '1h';
        break;
      case 'verify':
        exp = this.configService.get<string>('EXP_VERIFICATION') ?? '1d';
        break;
      default:
        exp = this.configService.get<string>('EXP_DEFAULT') ?? '1d';
        break;
    }

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: exp,
    });
  }

  private async generateAdminToken(admin: Admin): Promise<string> {
    const payload: JwtPayload = {
      userId: admin.uuid,
      email: admin.account,
      role: admin.power,
    }; // Sử dụng adminId và account
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('EXP_DEFAULT') ?? '1h',
    });
  }

  async verifyEmail(verificationToken: string): Promise<User> {
    let payload: any;
    try {
     payload = this.jwtService.verify(verificationToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (e) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn.');
    }

    const userUuid = payload.uuid;

    const user = await this.userService.findOne({ uuid: userUuid });
    if (!user) {
      throw new BadRequestException('Token xác minh không hợp lệ.');
    }

    if (user.isVerified) {
      throw new BadRequestException('Tài khoản đã được xác minh trước đó.');
    }

   

    return this.userService.markUserAsVerified(user.uuid);
  }

  async resetPassword(token: string, newPassword: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (e) {
      throw new UnauthorizedException(
        'Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
      );
    }

    const userUuid = payload.uuid;

    const user = await this.userService.findOne({ uuid: userUuid });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại.');
    }

    if (!user.isVerified) {
      console.log(
        `Email cho user ${user.emailUser} đã được tự động xác minh sau khi đặt lại mật khẩu.`,
      );
      user.isVerified = true;
      user.emailVerifiedAt = new Date();
      user.verificationToken = '';
    }

    const saltRounds =
      this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    console.log(
      'DEBUG: User state BEFORE calling userService.save:',
      user.passwordUser,
    );
    user.passwordUser = hashedPassword;
    console.log('mật khẩu đã hashed: ' + user.passwordUser);

    // return this.userService.saveUser(user);
    await this.userService.saveUser(user);

    // 4. NGAY SAU KHI userService.save(user) hoàn tất
    // (Lưu ý: để chắc chắn hơn, bạn có thể fetch lại user từ DB ngay đây và log nó)
    const updatedUserFromDB = await this.userService.findOne({ uuid: userUuid });
    console.log(
      'DEBUG: User state AFTER saving and RE-FETCHING from DB:',
      updatedUserFromDB.passwordUser,
    );
    return;
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async resendVerificationEmail(emailUser: string) {
    const user = await this.userService.findByEmail(emailUser);

    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email đã được xác minh.');
    }

    const token = await this.generateUserToken(user, 'verify');

    await this.supportSendEmail('resend', emailUser, user.nameUser, token);

    return token;
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    if (!user.isVerified) {
      throw new BadRequestException('Email chưa được xác minh. ');
    }

    const token = await this.generateUserToken(user, 'forgot');

    await this.supportSendEmail('forgot', email, user.nameUser, token);

    return token;
  }

  async supportSendEmail(
    dispatch: string,
    email: string,
    nameUser: string,
    token: string,
  ) {
    try {
      switch (dispatch) {
        case 'welcome':
          await this.authMailProducer.sendWelcomeEmail({
            to: email,
            userName: nameUser,
            verificationToken: token,
          });
          break;
        case 'forgot':
          await this.authMailProducer.sendForgotPasswordEmail({
            to: email,
            userName: nameUser,
            verificationToken: token,
          });
          break;
        case 'resend':
          await this.authMailProducer.resendVerificationEmail({
            to: email,
            userName: nameUser,
            verificationToken: token,
          });
          break;
        case 'reset':
          await this.authMailProducer.sendResetPasswordEmail({
            to: email,
            userName: nameUser,
            verificationToken: token,
          });
          break;
        default:
          break;
      }

      this.loggerService.logDebug(
        'AuthService',
        `Email job for ${email} added to queue.`,
        'info',
      );
    } catch (e) {
      this.loggerService.logDebug(
        'AuthService',
        `Failed to add email job to queue for ${email}: ${e.message}`,
        e.stack,
      );
      // Bạn có thể chọn cách xử lý ở đây:
      // 1. Throw error (nhưng người dùng đã được tạo, vậy nên không lý tưởng).
      // 2. Ghi log và tiếp tục (để người dùng vẫn nhận được phản hồi thành công, nhưng email có thể không gửi được).
      // 3. Đánh dấu người dùng cần xác minh lại hoặc có cơ chế gửi lại email.
      // Trong trường hợp này, chúng ta cứ ghi log và tiếp tục để không block request.
    }
  }
}
