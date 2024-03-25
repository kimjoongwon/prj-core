import { Module, OnModuleInit } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RolesModule, SpacesModule, SubjectsService } from '@shared/backend';
import { PasswordService } from 'src/auth/password.service';

@Module({
  imports: [SpacesModule, RolesModule],
  controllers: [AdminController],
  providers: [AdminService, SubjectsService, PasswordService],
})
export class AdminModule implements OnModuleInit {
  constructor(private adminService: AdminService) {}
  onModuleInit() {
    this.adminService.createSuperAdmin();
  }
}
