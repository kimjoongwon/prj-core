import { Injectable } from '@nestjs/common';
import { SpaceClassificationsRepository } from '../repository/space-classifications.repository';
import { BaseService } from './base.service';
import {
  CreateSpaceClassificationDto,
  SpaceClassification,
  UpdateSpaceClassificationDto,
} from '@shared/schema';

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
