import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Assignment } from '../entity';

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
