import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './auth/admin/admin.module';

@Module({
  imports: [AuthModule, AdminModule],
})
export class ApiModule {}
