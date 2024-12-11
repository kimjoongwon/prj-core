import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TenantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.TenantCreateArgs) {
    return this.prisma.tenant.create(args);
  }

  upsert(args: Prisma.TenantUpsertArgs) {
    return this.prisma.tenant.upsert(args);
  }

  update(args: Prisma.TenantUpdateArgs) {
    return this.prisma.tenant.update(args);
  }

  updateMany(args: Prisma.TenantUpdateManyArgs) {
    return this.prisma.tenant.updateMany(args);
  }

  delete(args: Prisma.TenantDeleteArgs) {
    return this.prisma.tenant.delete(args);
  }

  findMany(args: Prisma.TenantFindManyArgs) {
    return this.prisma.tenant.findMany({
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

  findUnique(args: Prisma.TenantFindUniqueArgs) {
    return this.prisma.tenant.findUnique(args);
  }

  findFirst(args: Prisma.TenantFindFirstArgs) {
    return this.prisma.tenant.findFirst(args);
  }

  count(args: Prisma.TenantCountArgs) {
    return this.prisma.tenant.count(args);
  }
}
