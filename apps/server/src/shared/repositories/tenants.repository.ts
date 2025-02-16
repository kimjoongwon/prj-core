import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
@UseEntity(Tenant)
export class TenantsRepository extends BaseRepository<
  Prisma.TenantCreateArgs,
  Prisma.TenantUpsertArgs,
  Prisma.TenantUpdateArgs,
  Prisma.TenantUpdateManyArgs,
  Prisma.TenantDeleteArgs,
  Prisma.TenantFindManyArgs,
  Prisma.TenantCountArgs,
  Prisma.TenantAggregateArgs,
  Prisma.TenantDeleteManyArgs,
  Prisma.TenantFindFirstArgs,
  Prisma.TenantFindUniqueArgs,
  Prisma.TenantGroupByArgs,
  Prisma.GroupCreateManyArgs,
  Tenant
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Tenant');
  }
}
