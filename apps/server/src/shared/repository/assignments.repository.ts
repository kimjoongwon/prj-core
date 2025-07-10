import { Injectable } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { Assignment } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

@Injectable()
@UseEntity(Assignment)
export class AssignmentsRepository extends BaseRepository<
  Prisma.AssignmentCreateArgs,
  Prisma.AssignmentUpsertArgs,
  Prisma.AssignmentUpdateArgs,
  Prisma.AssignmentUpdateManyArgs,
  Prisma.AssignmentDeleteArgs,
  Prisma.AssignmentFindManyArgs,
  Prisma.AssignmentCountArgs,
  Prisma.AssignmentAggregateArgs,
  Prisma.AssignmentDeleteManyArgs,
  Prisma.AssignmentFindFirstArgs,
  Prisma.AssignmentFindUniqueArgs,
  Prisma.AssignmentGroupByArgs,
  Prisma.AssignmentCreateManyArgs,
  Assignment
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Assignment');
  }
}
