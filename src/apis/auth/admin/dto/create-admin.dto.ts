import { IsString, MinLength, MaxLength, IsBoolean } from 'class-validator';

export class CreateAdminDto {
  @IsString({ message: 'Tên admin phải là chuỗi.' })
  @MinLength(3, { message: 'Tên admin phải có ít nhất 3 ký tự.' })
  @MaxLength(50, { message: 'Tên admin không được vượt quá 50 ký tự.' })
  nameAdmin: string;

  @IsString({ message: 'Tài khoản phải là chuỗi.' })
  @MinLength(3, { message: 'Tài khoản phải có ít nhất 3 ký tự.' })
  @MaxLength(50, { message: 'Tài khoản không được vượt quá 50 ký tự.' })
  account: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  password: string;

  @IsBoolean({ message: 'Trạng thái đăng nhập phải là boolean.' })
  isLogin: boolean;

  @IsString({ message: 'Quyền hạn phải là chuỗi.' })
  power: string;

  @IsBoolean({ message: 'Trạng thái hủy vai trò phải là boolean.' })
  cancelRole: boolean;
}
