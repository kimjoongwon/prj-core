import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import {
  RolesModule,
  ServicesModule,
  SpacesModule,
  SubjectsModule,
} from '@shared/backend';
import { PasswordService } from '../auth/password.service';

@Module({
  imports: [SpacesModule, RolesModule, ServicesModule, SubjectsModule],
  controllers: [AdminController],
  providers: [AdminService, PasswordService],
  exports: [AdminService],
})
export class AdminModule {}
