import { Module } from '@nestjs/common';
import { WorkspacesController, WorkspacesRepository, WorkspacesService } from '@shared';

@Module({
  providers: [WorkspacesService, WorkspacesRepository],
  controllers: [WorkspacesController],
})
export class WorkspacesModule {}
