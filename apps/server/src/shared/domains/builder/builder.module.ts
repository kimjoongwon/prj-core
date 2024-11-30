import { Module } from '@nestjs/common';
import { BuilderService } from './builder.service';
import { PagesModule } from '../../entities/pages/pages.module';

@Module({
  imports: [PagesModule],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
