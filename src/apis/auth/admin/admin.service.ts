import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '@app/common/entities/auth/admin.entity';
import { BaseService } from '@app/common/services/base.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService extends BaseService<Admin> {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {
    super(adminRepository); // Gọi constructor của BaseService
  }

  /**
   * Tạo một admin mới.
   * Mật khẩu sẽ được băm trước khi lưu.
   * @param createAdminDto DTO chứa thông tin admin mới.
   * @returns Đối tượng Admin đã được tạo.
   */
  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { password, ...adminData } = createAdminDto;

    // Kiểm tra tài khoản đã tồn tại chưa
    const existingAdmin = await this.adminRepository.findOne({
      where: { account: adminData.account },
    });
    if (existingAdmin) {
      throw new BadRequestException('Tài khoản admin đã tồn tại.');
    }

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = this.adminRepository.create({
      ...adminData,
      password: hashedPassword,
    });

    return this.adminRepository.save(newAdmin);
  }

  /**
   * Cập nhật thông tin admin.
   * Nếu có newPassword, mật khẩu sẽ được băm lại.
   * @param adminId ID của admin cần cập nhật.
   * @param updateAdminDto DTO chứa thông tin cập nhật.
   * @returns Đối tượng Admin đã được cập nhật.
   */
  async updateAdmin(
    adminId: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    const admin = await this.findOne({ uuid: adminId }); // Sử dụng findOne từ BaseService

    if (updateAdminDto.newPassword) {
      admin.password = await bcrypt.hash(updateAdminDto.newPassword, 10);
      delete updateAdminDto.newPassword; // Xóa trường newPassword
    }

    Object.assign(admin, updateAdminDto);
    return this.adminRepository.save(admin);
  }

  /**
   * Tìm admin bằng tài khoản.
   * @param account Tài khoản của admin.
   * @returns Đối tượng Admin hoặc null nếu không tìm thấy.
   */
  async findByAccount(account: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { account } });
  }
}
