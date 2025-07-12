import { Injectable } from '@nestjs/common';
import { Prisma, Tenant } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { BaseRepository } from '../common/base.repository';
import { UseEntity } from '../decorator/use-dto.decorator';

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
  Prisma.TenantCreateManyAndReturnArgs,
  Tenant
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Tenant');
  }
}
