import { Module } from '@nestjs/common';
import { TemplatesModule } from '@shared';
import { TemplatesController } from './admin-templates.controller';

@Module({
  controllers: [TemplatesController],
  imports: [TemplatesModule],
})
export class AdminTemplatesModule {}
