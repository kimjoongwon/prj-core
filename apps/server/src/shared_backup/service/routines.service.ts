import { Injectable } from '@nestjs/common';
import { RoutinesRepository } from '../repository/routines.repository';
import { CreateRoutineDto, UpdateRoutineDto } from '../dto';
import { BaseService } from './base.service';
import { Routine } from '../entity/routine.entity';

@Injectable()
export class RoutinesService extends BaseService<
  CreateRoutineDto,
  UpdateRoutineDto,
  any,
  Routine,
  RoutinesRepository
> {
  constructor(readonly repository: RoutinesRepository) {
    super(repository);
  }
}
