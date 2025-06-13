// activity-log.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'entity_name', nullable: false })
  entity: string;

  @Column({ name: 'action_name', nullable: false })
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column({ name: 'old_value', type: 'json', nullable: true })
  oldValue?: any;

  @Column({ name: 'new_value', type: 'json', nullable: true })
  newValue?: any;

  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
