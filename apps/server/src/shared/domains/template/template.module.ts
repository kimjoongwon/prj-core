import { Module } from '@nestjs/common';
import { TemplateService } from './Template.service';
import { TemplatesModule } from '../../entities';

@Module({
  imports: [TemplatesModule],
  providers: [TemplateService],
  exports: [TemplateService, TemplatesModule],
})
export class TemplateModule {}
