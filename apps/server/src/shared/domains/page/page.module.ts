import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PagesModule } from '../../entities/pages/pages.module';

@Module({
  imports: [PagesModule],
  providers: [PageService],
  exports: [PageService],
})
export class PageModule {}
