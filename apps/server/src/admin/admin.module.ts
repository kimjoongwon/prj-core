import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SubjectsService } from '@coc/server';

@Module({
  controllers: [AdminController],
  providers: [AdminService, SubjectsService],
})
export class AdminModule {}
