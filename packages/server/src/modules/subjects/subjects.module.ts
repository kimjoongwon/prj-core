import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';

@Module({
  controllers: [],
  providers: [SubjectsService],
})
export class SubjectsModule {}
