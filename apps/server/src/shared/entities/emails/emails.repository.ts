import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IRepository } from '../../types/interfaces/repository.interface';

@Injectable()
export class EmailsRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.EmailCreateArgs) {
    return this.prisma.email.create(args);
  }

  upsert(args: Prisma.EmailUpsertArgs) {
    return this.prisma.email.upsert(args);
  }

  update(args: Prisma.EmailUpdateArgs) {
    return this.prisma.email.update(args);
  }

  updateMany(args: Prisma.EmailUpdateManyArgs) {
    return this.prisma.email.updateMany(args);
  }

  delete(args: Prisma.EmailDeleteArgs) {
    return this.prisma.email.delete(args);
  }

  findMany(args: Prisma.EmailFindManyArgs) {
    return this.prisma.email.findMany({
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

  findUnique(args: Prisma.EmailFindUniqueArgs) {
    return this.prisma.email.findUnique(args);
  }

  findFirst(args: Prisma.EmailFindFirstArgs) {
    return this.prisma.email.findFirst(args);
  }

  count(args: Prisma.EmailCountArgs) {
    return this.prisma.email.count(args);
  }
}
