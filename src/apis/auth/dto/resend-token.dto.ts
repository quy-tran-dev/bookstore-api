
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendTokenDto {
  @ApiProperty({
    description: 'Địa chỉ email của người dùng để đặt lại mật khẩu',
    example: 'user@gmail.com',
  })
  @IsEmail({}, { message: 'Địa chỉ email không hợp lệ.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  emailUser: string;
}