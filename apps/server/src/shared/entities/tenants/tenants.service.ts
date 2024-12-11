import { Injectable } from '@nestjs/common';
import { TenantsRepository } from './tenants.repository';
import { TenantPageQueryDto, UpdateTenantDto } from './dtos';
import { Prisma } from '@prisma/client';
import { PaginationUtil } from '@shared/utils';
@Injectable()
export class TenantsService {
  constructor(private readonly repository: TenantsRepository) {}

  getUnique(args: Prisma.TenantFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(id: string) {
    return this.repository.findFirst({ where: { id } });
  }

  removeMany(ids: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        removedAt: new Date(),
      },
    });
  }

  delete(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(args: Prisma.TenantCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(pageQuery: TenantPageQueryDto) {
    const args = PaginationUtil.toArgs(pageQuery);
    const tenants = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      tenants,
      count,
    };
  }

  update(tenantId: string, updateTenantDto: UpdateTenantDto) {
    return this.repository.update({
      where: {
        id: tenantId,
      },
      data: updateTenantDto,
    });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
