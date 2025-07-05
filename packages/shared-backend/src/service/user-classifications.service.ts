import { Injectable } from '@nestjs/common';
import { UserClassificationsRepository } from '../repository/user-classifications.repository';
import { BaseService } from './base.service';
import { CreateUserClassificationDto, UpdateUserClassificationDto } from '@shared/schema';
import { UserClassification } from '../entity';

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
