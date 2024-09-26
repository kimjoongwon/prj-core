import { Module } from '@nestjs/common';
import { TemplatesModule } from '@shared';
import { AdminTemplatesController } from './admin-templates.controller';

@Module({
  imports: [TemplatesModule],
  controllers: [AdminTemplatesController],
})
export class AdminTemplatesModule {}
