import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsRepository, SubjectsService } from '@shared';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService, SubjectsRepository],
})
export class SubjectsModule {}
