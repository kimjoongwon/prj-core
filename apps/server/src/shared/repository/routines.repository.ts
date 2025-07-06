import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Routine } from '@shared/schema';

@Injectable()
@UseEntity(Routine)
export class RoutinesRepository extends BaseRepository<
  Prisma.RoutineCreateArgs,
  Prisma.RoutineUpsertArgs,
  Prisma.RoutineUpdateArgs,
  Prisma.RoutineUpdateManyArgs,
  Prisma.RoutineDeleteArgs,
  Prisma.RoutineFindManyArgs,
  Prisma.RoutineCountArgs,
  Prisma.RoutineAggregateArgs,
  Prisma.RoutineDeleteManyArgs,
  Prisma.RoutineFindFirstArgs,
  Prisma.RoutineFindUniqueArgs,
  Prisma.RoutineGroupByArgs,
  Prisma.RoutineCreateManyAndReturnArgs,
  Routine
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Routine');
  }
}
