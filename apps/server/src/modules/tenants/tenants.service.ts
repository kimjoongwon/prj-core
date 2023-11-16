import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { queryBuilder } from '@common';
import { PaginatedTenant, TenantForm } from './models';
import { CreateTenantInput, GetTenantsArgs, UpdateTenantInput } from './dto';
import { PrismaService } from '@modules/global/prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTenantInput: CreateTenantInput) {
    return this.prisma.tenant.create({
      data: createTenantInput,
    });
  }

  findForm(): TenantForm {
    return {};
  }

  async findPaginatedTenant(args: GetTenantsArgs): Promise<PaginatedTenant> {
    const query = queryBuilder(args, []) as any;

    const tenants = await this.prisma.tenant.findMany({
      // ...query,
      include: {
        space: {
          include: {
            owner: true,
          },
        },
        user: true,
      },
    });

    const totalCount = await this.prisma.tenant.count({
      where: query?.where,
    });

    const endCursor = last(tenants)?.id;

    return {
      edges: tenants.map(tenant => ({ node: tenant })),
      nodes: tenants,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(tenants.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.tenant.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateTenantInput) {
    return this.prisma.tenant.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
