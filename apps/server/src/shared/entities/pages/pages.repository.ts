import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IRepository } from '../../types/interfaces/repository.interface';

@Injectable()
export class PagesRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.PageCreateArgs) {
    return this.prisma.page.create(args);
  }

  upsert(args: Prisma.PageUpsertArgs) {
    return this.prisma.page.upsert(args);
  }

  update(args: Prisma.PageUpdateArgs) {
    return this.prisma.page.update(args);
  }

  updateMany(args: Prisma.PageUpdateManyArgs) {
    return this.prisma.page.updateMany(args);
  }

  delete(args: Prisma.PageDeleteArgs) {
    return this.prisma.page.delete(args);
  }

  findMany(args: Prisma.PageFindManyArgs) {
    return this.prisma.page.findMany({
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

  findUnique(args: Prisma.PageFindUniqueArgs) {
    return this.prisma.page.findUnique(args);
  }

  findFirst(args: Prisma.PageFindFirstArgs) {
    return this.prisma.page.findFirst(args);
  }

  count(args: Prisma.PageCountArgs) {
    return this.prisma.page.count(args);
  }
}
