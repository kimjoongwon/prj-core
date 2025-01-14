import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Ability } from '../entities/ability.entity';

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
