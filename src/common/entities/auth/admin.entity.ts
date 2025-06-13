import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('admin') 
export class Admin extends BaseEntity {

  @Column({name: 'name_admin',  nullable: false })
  nameAdmin: string;

  @Column({name: 'account', unique: true, nullable: false }) 
  account: string;

  @Column({ name: 'password',nullable: false }) 
  password: string;

  @Column({name: 'is_login', default: false })
  isLogin: boolean;

  @Column({name: 'power', nullable: false, default: 0 }) 
  power: number;

  @Column({ name: 'cancel_role',default: false })
  cancelRole: boolean;
}
