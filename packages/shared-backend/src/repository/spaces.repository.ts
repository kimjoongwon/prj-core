import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Space } from '@shared/schema';

@Injectable()
@UseEntity(Space)
export class SpacesRepository extends BaseRepository<
  Prisma.SpaceCreateArgs,
  Prisma.SpaceUpsertArgs,
  Prisma.SpaceUpdateArgs,
  Prisma.SpaceUpdateManyArgs,
  Prisma.SpaceDeleteArgs,
  Prisma.SpaceFindManyArgs,
  Prisma.SpaceCountArgs,
  Prisma.SpaceAggregateArgs,
  Prisma.SpaceDeleteManyArgs,
  Prisma.SpaceFindFirstArgs,
  Prisma.SpaceFindUniqueArgs,
  Prisma.SpaceGroupByArgs,
  Prisma.SpaceCreateManyArgs,
  Space
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Space');
  }
}
