import { Module } from '@nestjs/common';
import { ProgramsService } from '../services';
import { ProgramsRepository } from '../repositories';

@Module({
  providers: [ProgramsService, ProgramsRepository],
  exports: [ProgramsService],
})
export class ProgramsModule {}
