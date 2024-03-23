import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';

@Module({
  providers: [PagesService],
})
export class PagesModule {}
