import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserClassificationsRepository } from '../repository/user-classifications.repository';
import { BaseService } from './base.service';

@Injectable()
export class ClassificationsService extends BaseService<
  CreateClass
> {
  constructor(private readonly repository: UserClassificationsRepository) {}
}
