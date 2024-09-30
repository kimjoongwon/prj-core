import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesRepository } from './pages.repository';

@Module({
  providers: [PagesService, PagesRepository],
  exports: [PagesService],
})
export class PagesModule {}
