import { Injectable } from '@nestjs/common';
import type {
  CreateUserClassificationDto,
  UpdateUserClassificationDto,
  UserClassification,
} from '@shared/schema';
import type { UserClassificationsRepository } from '../repository/user-classifications.repository';
import { BaseService } from './base.service';

@Injectable()
export class UserClassificationsService extends BaseService<
  CreateUserClassificationDto,
  UpdateUserClassificationDto,
  any,
  UserClassification,
  UserClassificationsRepository
> {
  constructor(readonly repository: UserClassificationsRepository) {
    super(repository);
  }
}
