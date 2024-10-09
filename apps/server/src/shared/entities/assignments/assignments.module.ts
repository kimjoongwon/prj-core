import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsRepository } from './assignments.repository';

@Module({
  providers: [AssignmentsService, AssignmentsRepository],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
