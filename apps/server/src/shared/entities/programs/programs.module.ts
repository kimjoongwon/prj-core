import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramsRepository } from './programs.repository';
import { ProgramsController } from './programs.controller';

@Module({
  controllers: [ProgramsController],
  providers: [ProgramsService, ProgramsRepository],
  exports: [ProgramsService],
})
export class ProgramsModule {}
