import { Module } from '@nestjs/common';
import { UserModule } from '@shared';
import { AssignmentsEndpoint } from './assignments.endpoint';

@Module({
  imports: [UserModule],
  controllers: [AssignmentsEndpoint],
})
export class AssignmentsEndpointModule {}
