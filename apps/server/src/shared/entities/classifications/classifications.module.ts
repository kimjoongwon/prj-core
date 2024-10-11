import { Module } from '@nestjs/common';
import { ClassificationsService } from './classifications.service';
import { ClassificationsRepository } from './classifications.repository';

@Module({
  providers: [ClassificationsService, ClassificationsRepository],
  exports: [ClassificationsService],
})
export class ClassificationsModule {}
