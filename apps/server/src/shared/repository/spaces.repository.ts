import { Injectable } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { Space } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

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
