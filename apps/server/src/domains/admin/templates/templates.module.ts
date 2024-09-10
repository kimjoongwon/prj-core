import { Module } from '@nestjs/common';
import { TemplateModule } from '@shared';
import { TemplatesController } from './templates.controller';

@Module({
  controllers: [TemplatesController],
  imports: [TemplateModule],
})
export class TemplatesModule {}
