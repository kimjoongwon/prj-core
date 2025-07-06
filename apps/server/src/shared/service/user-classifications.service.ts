import { Injectable } from '@nestjs/common';
import { UserClassificationsRepository } from '../repository/user-classifications.repository';
import { BaseService } from './base.service';
import {
  CreateUserClassificationDto,
  UpdateUserClassificationDto,
  UserClassification,
} from '@shared/schema';

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
