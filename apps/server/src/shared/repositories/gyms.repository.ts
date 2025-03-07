import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Gym } from '../entities/gym.entity';

@Injectable()
@UseEntity(Gym)
export class GymsRepository extends BaseRepository<
  Prisma.GymCreateArgs,
  Prisma.GymUpsertArgs,
  Prisma.GymUpdateArgs,
  Prisma.GymUpdateManyArgs,
  Prisma.GymDeleteArgs,
  Prisma.GymFindManyArgs,
  Prisma.GymCountArgs,
  Prisma.GymAggregateArgs,
  Prisma.GymDeleteManyArgs,
  Prisma.GymFindFirstArgs,
  Prisma.GymFindUniqueArgs,
  Prisma.GymGroupByArgs,
  Prisma.GroupCreateManyArgs,
  Gym
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Gym');
  }
}
