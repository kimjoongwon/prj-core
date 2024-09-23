import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenanciesRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(args: Prisma.TenancyCreateArgs) {
    return this.prisma.tenancy.create(args);
  }

  upsert(args: Prisma.TenancyUpsertArgs) {
    return this.prisma.tenancy.upsert(args);
  }

  update(args: Prisma.TenancyUpdateArgs) {
    return this.prisma.tenancy.update(args);
  }

  updateMany(args: Prisma.TenancyUpdateManyArgs) {
    return this.prisma.tenancy.updateMany(args);
  }

  delete(args: Prisma.TenancyDeleteArgs) {
    return this.prisma.tenancy.delete(args);
  }

  findMany(args: Prisma.TenancyFindManyArgs) {
    return this.prisma.tenancy.findMany({
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

  findUnique(args: Prisma.TenancyFindUniqueArgs) {
    return this.prisma.tenancy.findUnique(args);
  }

  findFirst(args: Prisma.TenancyFindFirstArgs) {
    return this.prisma.tenancy.findFirst(args);
  }

  count(args: Prisma.TenancyCountArgs) {
    return this.prisma.tenancy.count(args);
  }
}
