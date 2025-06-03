import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { BaseService } from '@app/common/services/base.service';
import { UserDetail } from '@app/common/entities/auth/user-detail.entity';

@Injectable()
export class UserDetailService extends BaseService<UserDetail> {
  constructor(
    @InjectRepository(UserDetail)
    private userDetailRepository: Repository<UserDetail>,
  ) {
    super(userDetailRepository); // Gọi constructor của BaseService
  }

  /**
   * Tạo chi tiết người dùng mới.
   * @param createUserDetailDto DTO chứa thông tin chi tiết người dùng mới.
   * @returns Đối tượng UserDetail đã được tạo.
   */
  async createUserDetail(
    createUserDetailDto: CreateUserDetailDto,
  ): Promise<UserDetail> {
    const newDetail = this.userDetailRepository.create(createUserDetailDto);
    return this.userDetailRepository.save(newDetail);
  }

  /**
   * Cập nhật chi tiết người dùng.
   * @param userId ID của chi tiết người dùng cần cập nhật.
   * @param updateUserDetailDto DTO chứa thông tin cập nhật.
   * @returns Đối tượng UserDetail đã được cập nhật.
   */
  async updateUserDetail(
    userId: string,
    updateUserDetailDto: UpdateUserDetailDto,
  ): Promise<UserDetail> {
    const userDetail = await this.findOne({ userId }); // Sử dụng findOne từ BaseService
    Object.assign(userDetail, updateUserDetailDto);
    return this.userDetailRepository.save(userDetail);
  }

  /**
   * Tìm chi tiết người dùng bằng userId.
   * @param userId ID của người dùng.
   * @returns Đối tượng UserDetail hoặc null nếu không tìm thấy.
   */
  async findByUserId(userId: string): Promise<UserDetail | null> {
    return this.userDetailRepository.findOne({ where: { userId } });
  }
}
