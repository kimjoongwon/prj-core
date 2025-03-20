import { Module } from '@nestjs/common';
import { AssignmentsController, AssignmentsRepository, AssignmentsService } from '@shared';

@Module({
  providers: [AssignmentsService, AssignmentsRepository],
  controllers: [AssignmentsController],
})
export class AssignmentsEndpointModule {}
