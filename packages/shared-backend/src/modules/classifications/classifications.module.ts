import { Module } from '@nestjs/common';
import { ClassificationsService } from './classifications.service';

@Module({
  providers: [ClassificationsService],
})
export class ClassificationsModule {}
