import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('admin') 
export class Admin extends BaseEntity {

  @Column({ unique: true, nullable: false })
  nameAdmin: string;

  @Column({ unique: true, nullable: false }) 
  account: string;

  @Column({ nullable: false }) 
  password: string;

  @Column({ default: false })
  isLogin: boolean;

  @Column({ nullable: false }) 
  power: string;

  @Column({ default: false })
  cancelRole: boolean;
}
