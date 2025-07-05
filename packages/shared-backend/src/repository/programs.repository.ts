import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Program } from '@shared/schema';

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
