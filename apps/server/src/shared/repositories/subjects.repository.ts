import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Subject } from '../entities/subject.entity';

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
  Prisma.GroupCreateManyArgs,
  Subject
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Subject');
  }
}
