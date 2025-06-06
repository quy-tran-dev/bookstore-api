import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserDetail } from './user-detail.entity';
import { BaseEntity } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ description: 'Tên người dùng', example: 'Đông' })
  @Column({ name: 'name_user', nullable: false })
  nameUser: string;

  @ApiProperty({
    description: 'Địa chỉ email người dùng',
    example: 'dong@example.com',
  })
  @Column({ name: 'email_user', unique: true })
  emailUser: string;

  @ApiProperty({
    description: 'Mật khẩu người dùng (đã hash)',
    example: 'hashed_password_string',
  })
  @Column({name: 'password_user', nullable: false })
  passwordUser: string;

  @ApiProperty({ description: 'Trạng thái xác minh tài khoản', example: false })
  @Column({name: 'is_verified', default: false })
  isVerified: boolean;

  @ApiProperty({
    description: 'Token dùng để xác minh tài khoản',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    nullable: true,
  })
  @Column({name: 'verification_token', nullable: true })
  verificationToken?: string;

  @ApiProperty({
    description: 'Thời gian email được xác minh',
    example: '2023-01-01T12:00:00Z',
    nullable: true,
  })
  @Column({name: 'verification_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @ApiProperty({ description: 'Thông tin chi tiết người dùng' })
  @OneToMany(() => UserDetail, (userDetail) => userDetail.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'uuid', referencedColumnName: 'user_id' }) // Khóa ngoại là userId trong bảng user_details, trỏ đến uuid của User
  userDetail: UserDetail;
}
