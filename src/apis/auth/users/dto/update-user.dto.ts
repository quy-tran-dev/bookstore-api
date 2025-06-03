import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger'; // Hoặc @nestjs/swagger nếu bạn dùng swagger
import { CreateUserDto } from './create-user.dto';

// PartialType giúp tạo một DTO mà tất cả các trường đều là tùy chọn
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Bạn có thể thêm các trường riêng cho update nếu cần
  @IsOptional()
  @IsString({ message: 'Mật khẩu mới phải là chuỗi.' })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' })
  newPassword?: string;
}
