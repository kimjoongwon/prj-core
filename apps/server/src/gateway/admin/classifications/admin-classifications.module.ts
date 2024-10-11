import { Module } from '@nestjs/common';
import { ClassificationsController, ClassificationsModule } from '@shared';
import { AdminClassificationsController } from './admin-classifications.controller';

@Module({
  imports: [ClassificationsModule],
  controllers: [AdminClassificationsController, ClassificationsController],
})
export class AdminClassificationsModule {}
