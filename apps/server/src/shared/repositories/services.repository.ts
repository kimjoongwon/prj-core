import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../../common/base.repository';
import { Service } from '../service.entity';
import { UseEntity } from '../../decorators/use-dto.decorator';

@Injectable()
@UseEntity(Service)
export class ServicesRepository extends BaseRepository<
  Prisma.ServiceCreateArgs,
  Prisma.ServiceUpsertArgs,
  Prisma.ServiceUpdateArgs,
  Prisma.ServiceUpdateManyArgs,
  Prisma.ServiceDeleteArgs,
  Prisma.ServiceFindManyArgs,
  Prisma.ServiceCountArgs,
  Prisma.ServiceAggregateArgs,
  Prisma.ServiceDeleteManyArgs,
  Prisma.ServiceFindFirstArgs,
  Prisma.ServiceFindUniqueArgs,
  Prisma.ServiceGroupByArgs,
  Prisma.ServiceCreateManyArgs,
  Service
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Service');
  }
}
