import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Seeder } from './seeder.interface';
import { v4 as uuidv4 } from 'uuid'; 
import { User } from '@app/common/entities/auth/user.entity';
import { UserDetail } from '@app/common/entities/auth/user-detail.entity';

export class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const userDetailRepository = dataSource.getRepository(UserDetail);

    // Seed User 1
    let existingUser1 = await userRepository.findOne({
      where: { emailUser: 'user1@example.com' },
    });

    if (!existingUser1) {
      const hashedPassword1 = await bcrypt.hash('password123', 10);
      const user1 = userRepository.create({
        nameUser: 'User One',
        emailUser: 'user1@example.com',
        passwordUser: hashedPassword1,
        isVerified: true,
        emailVerifiedAt: new Date(),
        // verificationToken sẽ là null vì đã verify
        // userDetail sẽ được tạo riêng
      });
      await userRepository.save(user1);

      const userDetail1 = userDetailRepository.create({
        userId: user1.uuid, // Gán UUID của user vừa tạo
        recipientName: 'Nguyễn Văn A',
        addressUser: '123 Đường ABC, Quận 1, TP.HCM',
        phoneUser: '0901234567',
        isUsed: true,
        user: user1, // Liên kết với đối tượng user
      });
      await userDetailRepository.save(userDetail1);
      console.log('User One and UserDetail created successfully!');
    } else {
      console.log('User One already exists, skipping seeding.');
    }

    // Seed User 2 (Chưa xác minh)
    let existingUser2 = await userRepository.findOne({
      where: { emailUser: 'user2@example.com' },
    });

    if (!existingUser2) {
      const hashedPassword2 = await bcrypt.hash('password456', 10);
      const user2 = userRepository.create({
        nameUser: 'User Two',
        emailUser: 'user2@example.com',
        passwordUser: hashedPassword2,
        isVerified: false,
        verificationToken: uuidv4(), // Tạo token xác minh
        // emailVerifiedAt sẽ null
        // userDetail sẽ được tạo riêng
      });
      await userRepository.save(user2);

      const userDetail2 = userDetailRepository.create({
        userId: user2.uuid,
        recipientName: 'Trần Thị B',
        addressUser: '456 Đường XYZ, Quận 3, TP.HCM',
        phoneUser: '0987654321',
        isUsed: false,
        user: user2,
      });
      await userDetailRepository.save(userDetail2);
      console.log('User Two and UserDetail created successfully!');
    } else {
      console.log('User Two already exists, skipping seeding.');
    }

    // Bạn có thể thêm nhiều user khác theo cách tương tự
  }
}