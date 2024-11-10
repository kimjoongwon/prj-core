import { Module } from '@nestjs/common';
import { PageService } from '@shared';
import { AdminPagesController } from './admin-pages.controller';

@Module({
  controllers: [AdminPagesController],
  providers: [PageService],
})
export class AdminPagesModule {}
