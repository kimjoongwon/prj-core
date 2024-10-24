import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IRepository } from '../../types/interfaces/repository.interface';

@Injectable()
export class ProgramsRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.ProgramCreateArgs) {
    return this.prisma.program.create(args);
  }

  upsert(args: Prisma.ProgramUpsertArgs) {
    return this.prisma.program.upsert(args);
  }

  update(args: Prisma.ProgramUpdateArgs) {
    return this.prisma.program.update(args);
  }

  updateMany(args: Prisma.ProgramUpdateManyArgs) {
    return this.prisma.program.updateMany(args);
  }

  delete(args: Prisma.ProgramDeleteArgs) {
    return this.prisma.program.delete(args);
  }

  findMany(args: Prisma.ProgramFindManyArgs) {
    return this.prisma.program.findMany({
      ...args,
      where: {
        removedAt: null,
        ...args.where,
      },
      orderBy: {
        ...args.orderBy,
      },
    });
  }

  findUnique(args: Prisma.ProgramFindUniqueArgs) {
    return this.prisma.program.findUnique(args);
  }

  findFirst(args: Prisma.ProgramFindFirstArgs) {
    return this.prisma.program.findFirst(args);
  }

  count(args: Prisma.ProgramCountArgs) {
    return this.prisma.program.count(args);
  }
}
