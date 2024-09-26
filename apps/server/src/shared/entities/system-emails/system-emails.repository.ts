import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IRepository } from '../../types/interfaces/repository.interface';

@Injectable()
export class SystemEmailsRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.SystemEmailCreateArgs) {
    return this.prisma.systemEmail.create(args);
  }

  upsert(args: Prisma.SystemEmailUpsertArgs) {
    return this.prisma.systemEmail.upsert(args);
  }

  update(args: Prisma.SystemEmailUpdateArgs) {
    return this.prisma.systemEmail.update(args);
  }

  updateMany(args: Prisma.SystemEmailUpdateManyArgs) {
    return this.prisma.systemEmail.updateMany(args);
  }

  delete(args: Prisma.SystemEmailDeleteArgs) {
    return this.prisma.systemEmail.delete(args);
  }

  findMany(args: Prisma.SystemEmailFindManyArgs) {
    return this.prisma.systemEmail.findMany({
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

  findUnique(args: Prisma.SystemEmailFindUniqueArgs) {
    return this.prisma.systemEmail.findUnique(args);
  }

  findFirst(args: Prisma.SystemEmailFindFirstArgs) {
    return this.prisma.systemEmail.findFirst(args);
  }

  count(args: Prisma.SystemEmailCountArgs) {
    return this.prisma.systemEmail.count(args);
  }
}
