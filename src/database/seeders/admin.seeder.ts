// src/database/seeds/admin.seeder.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Seeder } from './seeder.interface';
import { Admin } from '@app/common/entities/auth/admin.entity';

export class AdminSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const adminRepository = dataSource.getRepository(Admin);

    const existingAdmin = await adminRepository.findOne({
      where: { account: 'admin@bookstore.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10); // Hash mật khẩu
      const admin = adminRepository.create({
        nameAdmin: 'Super Admin',
        account: 'admin@bookstore.com',
        password: hashedPassword,
        isLogin: false,
        power: 0,
        cancelRole: false,
      });

      await adminRepository.save(admin);
      console.log('Admin account created successfully!');
    } else {
      console.log('Admin account already exists, skipping seeding.');
    }
  }
}