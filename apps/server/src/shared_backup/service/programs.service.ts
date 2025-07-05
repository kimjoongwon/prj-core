import { Injectable } from '@nestjs/common';
import { ProgramsRepository } from '../repository/programs.repository';
import { CreateProgramDto, QueryProgramDto, UpdateProgramDto } from '../dto';
import { Program } from '../entity/program.entity';
import { BaseService } from './base.service';

@Injectable()
export class ProgramsService extends BaseService<
  CreateProgramDto,
  UpdateProgramDto,
  QueryProgramDto,
  Program,
  ProgramsRepository
> {
  constructor(readonly repository: ProgramsRepository) {
    super(repository);
  }
}
