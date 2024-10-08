import { Module } from '@nestjs/common';
import { TemplatesService } from './assignments.service';
import { TemplatesRepository } from './assignments.repository';
import { TemplatesController } from './assignments.controller';

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService, TemplatesRepository],
  exports: [TemplatesService],
})
export class TemplatesModule {}
