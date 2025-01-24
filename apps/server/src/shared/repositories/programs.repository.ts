import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Program } from '../entities/program.entity';

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
  Prisma.GroupCreateManyArgs,
  Program
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Program');
  }
}
