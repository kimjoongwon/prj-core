import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Ability } from '@shared/schema';

@Injectable()
@UseEntity(Ability)
export class AbilitiesRepository extends BaseRepository<
  Prisma.AbilityCreateArgs,
  Prisma.AbilityUpsertArgs,
  Prisma.AbilityUpdateArgs,
  Prisma.AbilityUpdateManyArgs,
  Prisma.AbilityDeleteArgs,
  Prisma.AbilityFindManyArgs,
  Prisma.AbilityCountArgs,
  Prisma.AbilityAggregateArgs,
  Prisma.AbilityDeleteManyArgs,
  Prisma.AbilityFindFirstArgs,
  Prisma.AbilityFindUniqueArgs,
  Prisma.AbilityGroupByArgs,
  Prisma.GroupCreateManyArgs,
  Ability
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Ability');
  }
}
