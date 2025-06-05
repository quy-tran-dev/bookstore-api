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

  @Column({name: 'user_id', type: 'uuid', unique: true, nullable: false })
  userId: string; 

  @Column({ name: 'recipient_name', nullable: true }) 
  recipientName: string;

  @Column({ name: 'address_user',nullable: true }) 
  addressUser: string;

  @Column({ name: 'phone_user',nullable: true })
  phoneUser: string;

  @Column({name: 'is_used', default: false }) 
  isUsed: boolean;

  // Mối quan hệ 1-1 với User
  @ManyToOne(() => User, user => user.userDetail)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'uuid' }) // Khóa ngoại là userId trong bảng user_details, trỏ đến uuid của User
  user: User;
}
