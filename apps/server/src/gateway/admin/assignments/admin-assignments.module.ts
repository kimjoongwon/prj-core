import { Module } from '@nestjs/common';
import { AssignmentsController, AssignmentsModule } from '@shared';
import { AdminAssignmentsController } from './admin-assignments.controller';

@Module({
  imports: [AssignmentsModule],
  controllers: [AdminAssignmentsController, AssignmentsController],
})
export class AdminAssignmentsModule {}
