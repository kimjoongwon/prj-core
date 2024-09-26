import { Module } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { AuthAdminController } from './auth-admin.controller';

@Module({
  controllers: [AuthAdminController],
  providers: [AuthAdminService],
})
export class AuthAdminModule {}
