import { Module } from '@nestjs/common';
import { SubjectsRepository } from '../repositories';
import { SubjectsService } from '../services/subjects.service';

@Module({
  providers: [SubjectsService, SubjectsRepository],
  exports: [SubjectsService],
})
export class SubjectLogicModule {}
