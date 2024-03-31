import { Module, OnModuleInit } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import {
  RolesModule,
  ServicesModule,
  SpacesModule,
  SubjectsModule,
} from '@shared/backend';
import { PasswordService } from 'src/auth/password.service';

@Module({
  imports: [SpacesModule, RolesModule, ServicesModule, SubjectsModule],
  controllers: [AdminController],
  providers: [AdminService, PasswordService],
})
export class AdminModule implements OnModuleInit {
  constructor(private adminService: AdminService) {}
  onModuleInit() {
    this.adminService.createSuperAdmin();
  }
}
