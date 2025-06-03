import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../base.entity';


@Entity('user_details')
export class UserDetail extends BaseEntity { 

  @Column({ type: 'uuid', unique: true, nullable: false })
  userId: string; 

  @Column({ nullable: true }) 
  recipientName: string;

  @Column({ nullable: true }) 
  addressUser: string;

  @Column({ nullable: true })
  phoneUser: string;

  @Column({ default: false }) 
  isUsed: boolean;

  // Mối quan hệ 1-1 với User
  @ManyToOne(() => User, user => user.userDetail)
  @JoinColumn({ name: 'userId', referencedColumnName: 'uuid' }) // Khóa ngoại là userId trong bảng user_details, trỏ đến uuid của User
  user: User;
}
