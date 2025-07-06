import { Injectable } from '@nestjs/common';
import { RoutinesRepository } from '../repository/routines.repository';
import { CreateRoutineDto, Routine, UpdateRoutineDto } from '@shared/schema';
import { BaseService } from './base.service';

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
