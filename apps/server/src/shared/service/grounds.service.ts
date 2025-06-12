import { Injectable } from '@nestjs/common';
import { GroundsRepository } from '../repository/grounds.repository';
import { CreateGroundDto, QueryGroundDto, UpdateGroundDto } from '../dto';
import { BaseService } from './base.service';
import { Ground } from '../entity';

@Injectable()
export class GroundsService extends BaseService<
  CreateGroundDto,
  UpdateGroundDto,
  QueryGroundDto,
  Ground,
  GroundsRepository
> {
  constructor(repository: GroundsRepository) {
    super(repository, {
      includeMap: {
        getById: {
          space: true,
        },
        getManyByQuery: {
          space: true,
        },
      },
    });
  }
}
