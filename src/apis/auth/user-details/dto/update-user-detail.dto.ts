import { PartialType } from '@nestjs/swagger';
import { CreateUserDetailDto } from './create-user-detail.dto';

export class UpdateUserDetailDto extends PartialType(CreateUserDetailDto) {
  // Không cần thêm gì đặc biệt ở đây nếu các trường update tương tự create
}