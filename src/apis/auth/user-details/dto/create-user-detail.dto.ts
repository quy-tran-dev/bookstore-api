
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateUserDetailDto {
  @IsUUID('4', { message: 'userId phải là UUID hợp lệ.' })
  userId: string; // Khóa ngoại liên kết với User

  @IsOptional()
  @IsString({ message: 'Tên người nhận phải là chuỗi.' })
  recipientName?: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ người dùng phải là chuỗi.' })
  addressUser?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi.' })
  phoneUser?: string;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái sử dụng phải là boolean.' })
  isUsed?: boolean;
}
