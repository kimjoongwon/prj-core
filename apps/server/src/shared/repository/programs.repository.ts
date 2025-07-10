import { Injectable } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { Program } from '@shared/schema';
import type { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

@Injectable()
@UseEntity(Program)
export class ProgramsRepository extends BaseRepository<
  Prisma.ProgramCreateArgs,
  Prisma.ProgramUpsertArgs,
  Prisma.ProgramUpdateArgs,
  Prisma.ProgramUpdateManyArgs,
  Prisma.ProgramDeleteArgs,
  Prisma.ProgramFindManyArgs,
  Prisma.ProgramCountArgs,
  Prisma.ProgramAggregateArgs,
  Prisma.ProgramDeleteManyArgs,
  Prisma.ProgramFindFirstArgs,
  Prisma.ProgramFindUniqueArgs,
  Prisma.ProgramGroupByArgs,
  Prisma.ProgramCreateManyAndReturnArgs,
  Program
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Program');
  }
}
