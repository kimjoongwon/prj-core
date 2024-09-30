import { Module } from '@nestjs/common';
import { PageModule, PagesController, PagesModule } from '@shared';
import { AdminPagesController } from './admin-pages.controller';

@Module({
  imports: [PagesModule, PageModule],
  controllers: [AdminPagesController, PagesController],
})
export class AdminPagesModule {}
