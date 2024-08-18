import { Module } from '@nestjs/common';
import { SubjectRepository } from './subject.repository';
import { SubjectService } from './subject.service';

@Module({
  providers: [SubjectService, SubjectRepository],
  exports: [SubjectService],
})
export class SubjectModule {}
