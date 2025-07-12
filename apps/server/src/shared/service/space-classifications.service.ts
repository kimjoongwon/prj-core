import { Injectable } from '@nestjs/common';
import {
  CreateSpaceClassificationDto,
  SpaceClassification,
  UpdateSpaceClassificationDto,
} from '@shared/schema';
import { SpaceClassificationsRepository } from '../repository/space-classifications.repository';
import { BaseService } from './base.service';

@Injectable()
export class SpaceClassificationsService extends BaseService<
  CreateSpaceClassificationDto,
  UpdateSpaceClassificationDto,
  any,
  SpaceClassification,
  SpaceClassificationsRepository
> {
  constructor(readonly repository: SpaceClassificationsRepository) {
    super(repository);
  }
}
