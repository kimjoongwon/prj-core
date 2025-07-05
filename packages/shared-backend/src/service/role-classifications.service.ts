import { Injectable } from '@nestjs/common';
import { RoleClassificationsRepository } from '../repository/role-classifications.repository';
import { BaseService } from './base.service';
import { CreateRoleClassificationDto, UpdateRoleClassificationDto, RoleClassification } from '@shared/schema';

@Injectable()
export class RoleClassificationsService extends BaseService<
  CreateRoleClassificationDto,
  UpdateRoleClassificationDto,
  any,
  RoleClassification,
  RoleClassificationsRepository
> {
  constructor(readonly repository: RoleClassificationsRepository) {
    super(repository);
  }
}
