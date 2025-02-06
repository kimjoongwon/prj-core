import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Exercise } from '../entities/exercise.entity';

@Injectable()
@UseEntity(Exercise)
export class ExercisesRepository extends BaseRepository<
  Prisma.ExerciseCreateArgs,
  Prisma.ExerciseUpsertArgs,
  Prisma.ExerciseUpdateArgs,
  Prisma.ExerciseUpdateManyArgs,
  Prisma.ExerciseDeleteArgs,
  Prisma.ExerciseFindManyArgs,
  Prisma.ExerciseCountArgs,
  Prisma.ExerciseAggregateArgs,
  Prisma.ExerciseDeleteManyArgs,
  Prisma.ExerciseFindFirstArgs,
  Prisma.ExerciseFindUniqueArgs,
  Prisma.ExerciseGroupByArgs,
  Prisma.GroupCreateManyArgs,
  Exercise
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Exercise');
  }
}
