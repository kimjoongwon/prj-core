import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesRepository } from './templates.repository';
import { TemplatesController } from './templates.controller';

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService, TemplatesRepository],
  exports: [TemplatesService],
})
export class TemplatesModule {}
