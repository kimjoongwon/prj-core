import { Injectable } from '@nestjs/common';
import {
  CreateUserClassificationDto,
  UpdateUserClassificationDto,
  UserClassification,
} from '@shared/schema';
import { UserClassificationsRepository } from '../repository/user-classifications.repository';
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
