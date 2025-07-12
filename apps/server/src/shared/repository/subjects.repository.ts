import { Injectable } from '@nestjs/common';
import { Prisma, Subject } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

@Injectable()
@UseEntity(Subject)
export class SubjectsRepository extends BaseRepository<
  Prisma.SubjectCreateArgs,
  Prisma.SubjectUpsertArgs,
  Prisma.SubjectUpdateArgs,
  Prisma.SubjectUpdateManyArgs,
  Prisma.SubjectDeleteArgs,
  Prisma.SubjectFindManyArgs,
  Prisma.SubjectCountArgs,
  Prisma.SubjectAggregateArgs,
  Prisma.SubjectDeleteManyArgs,
  Prisma.SubjectFindFirstArgs,
  Prisma.SubjectFindUniqueArgs,
  Prisma.SubjectGroupByArgs,
  Prisma.SubjectCreateManyAndReturnArgs,
  Subject
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Subject');
  }
}
