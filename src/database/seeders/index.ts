import { Seeder } from './seeder.interface';
import { AdminSeeder } from './admin.seeder';
import { UserSeeder } from './user.seeder';

export const seeders: Seeder[] = [new AdminSeeder(), new UserSeeder()];