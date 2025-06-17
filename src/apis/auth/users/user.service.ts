import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseService } from '@app/common/services/base.service';
import { User } from '@app/common/entities/auth/user.entity';
import { UserDetail } from '@app/common/entities/auth/user-detail.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDetailDto } from '../user-details/dto/create-user-detail.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserDetail) // Tiêm UserDetail Repository để tạo UserDetail cùng User
    private userDetailRepository: Repository<UserDetail>,
  ) {
    super(userRepository); // Gọi constructor của BaseService
  }

  /**
   * Tạo một người dùng mới.
   * Mật khẩu sẽ được băm trước khi lưu.
   * @param createUserDto DTO chứa thông tin người dùng mới.
   * @returns Đối tượng User đã được tạo.
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { passwordUser, ...userData } = createUserDto;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userRepository.findOne({
      where: { emailUser: userData.emailUser },
    });
    if (existingUser) {
      throw new BadRequestException('Email đã được đăng ký.');
    }

    const newUser = this.userRepository.create({
      ...userData,
      passwordUser: passwordUser,
      isVerified: false, // Mặc định chưa xác minh
      // verificationToken sẽ được tạo trong AuthService khi đăng ký
    });

    return this.userRepository.save(newUser);
  }

  /**
   * Cập nhật thông tin người dùng.
   * Nếu có newPassword, mật khẩu sẽ được băm lại.
   * @param userId ID của người dùng cần cập nhật.
   * @param updateUserDto DTO chứa thông tin cập nhật.
   * @returns Đối tượng User đã được cập nhật.
   */
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOne({ uuid: userId }); // Sử dụng findOne từ BaseService

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async saveUser(user: User): Promise<User> {
    console.log(
      'DEBUG: Value passed to userRepository.save:',
      user.passwordUser,
      user.isVerified,
    );
    return this.userRepository.save(user);
  }

  /**
   * Tìm người dùng bằng email.
   * @param email Email của người dùng.
   * @returns Đối tượng User hoặc null nếu không tìm thấy.
   */
  async findByEmail(emailUser: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { emailUser: emailUser } });
  }

  /**
   * Tạo hoặc cập nhật token xác minh cho người dùng.
   * @param user Đối tượng User.
   * @param tokenNew Token được tạo mới.
   * @returns Token xác minh.
   */
  async getOrCreateToken(user: User, tokenNew: string): Promise<string> {
    let token = tokenNew;
    if (user.verificationToken) {
      token = user.verificationToken;
    } else {
      await this.updateUser(user.uuid, {
        verificationToken: token,
      });
    }

    return token;
  }

  /**
   * Đánh dấu người dùng đã được xác minh.
   * @param userId ID của người dùng.
   * @returns Đối tượng User đã được cập nhật.
   */
  async markUserAsVerified(userId: string): Promise<User> {
    const user = await this.findOne({ uuid: userId });
    user.isVerified = true;
    user.emailVerifiedAt = new Date();
    user.verificationToken = ''; // Xóa token sau khi xác minh
    return this.userRepository.save(user);
  }

  /**
   * Tạo hoặc cập nhật chi tiết người dùng.
   * @param userId ID của người dùng.
   * @param userDetailDto DTO chi tiết người dùng.
   * @returns Đối tượng UserDetail đã được tạo/cập nhật.
   */
  async createOrUpdateUserDetail(
    userId: string,
    userDetailDto: Partial<CreateUserDetailDto>,
  ): Promise<UserDetail> {
    let userDetail = await this.userDetailRepository.findOne({
      where: { uuid: userId },
    });

    if (!userDetail) {
      // Tạo mới nếu chưa tồn tại
      userDetail = this.userDetailRepository.create({
        ...userDetailDto,
        uuid: userId,
      });
    } else {
      // Cập nhật nếu đã tồn tại
      Object.assign(userDetail, userDetailDto);
    }
    return this.userDetailRepository.save(userDetail);
  }

  async findByUserId(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { uuid: userId } });
  }
}
