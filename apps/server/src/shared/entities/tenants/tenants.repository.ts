import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TenantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(args: Prisma.TenantFindUniqueArgs) {
    return this.prisma.tenant.findUnique(args);
  }

  upsert(args: Prisma.TenantUpsertArgs) {
    return this.prisma.tenant.upsert(args);
  }
}
