import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Tên người dùng phải là chuỗi.' })
  @MinLength(3, { message: 'Tên người dùng phải có ít nhất 3 ký tự.' })
  @MaxLength(50, { message: 'Tên người dùng không được vượt quá 50 ký tự.' })
  nameUser: string;

  @IsEmail({}, { message: 'Email không hợp lệ.' })
  emailUser: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  passwordUser: string;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái xác minh phải là boolean.' })
  isVerified?: boolean;

  @IsOptional()
  @IsString({ message: 'Verification token phải là chuỗi.' })
  verificationToken?: string;
}
