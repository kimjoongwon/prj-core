import { Injectable } from '@nestjs/common';
import type { CreateRoutineDto, Routine, UpdateRoutineDto } from '@shared/schema';
import type { RoutinesRepository } from '../repository/routines.repository';
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
