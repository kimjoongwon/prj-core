import { Module } from '@nestjs/common';
import { ProgramsController, ProgramsRepository, ProgramsService } from '@shared/backend';

@Module({
  providers: [ProgramsService, ProgramsRepository],
  controllers: [ProgramsController],
})
export class ProgramsModule {}
