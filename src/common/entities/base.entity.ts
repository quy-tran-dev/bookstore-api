import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity as TypeOrmBaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Index,
} from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @ApiProperty({ description: 'UUID định danh duy nhất' })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({ description: 'Ngày tạo bản ghi' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Ngày cập nhật cuối cùng' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Ngày xoá (soft delete)' })
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  @Index()
  deletedAt: Date | null;

  @ApiProperty({ description: 'Người tạo bản ghi', required: false })
  @Column({ name: 'create_by', nullable: true })
  createBy?: string;

  @ApiProperty({ description: 'Người cập nhật cuối', required: false })
  @Column({ name: 'update_by', nullable: true })
  updateBy?: string;

  @ApiProperty({ description: 'Người xoá (nếu có)', required: false })
  @Column({ name: 'delete_by', nullable: true })
  deleteBy?: string;
}
