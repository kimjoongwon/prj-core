import { Injectable } from '@nestjs/common';
import { UpsertTenantDto } from './dtos/upsert-tenant.dto';
import { TenantsRepository } from './tenants.repository';
@Injectable()
export class TenantsService {
  constructor(private readonly repository: TenantsRepository) {}

  createOrUpdate(upsertTenantDto: UpsertTenantDto) {
    const { userId } = upsertTenantDto;
    return this.repository.upsert({
      where: {
        userId,
      },
      create: upsertTenantDto,
      update: upsertTenantDto,
    });
  }

  getUniqueById(tenantId: string) {
    return this.repository.findUnique({
      where: {
        id: tenantId,
      },
      include: {
        user: true,
        role: true,
        tenancy: {
          include: {
            space: true,
          },
        },
      },
    });
  }

  getActiveTenantByUserId(userId: string) {
    return this.repository.findUnique({
      where: {
        userId,
        active: true,
      },
      include: {
        user: true,
        role: true,
        tenancy: {
          include: {
            space: true,
          },
        },
      },
    });
  }
}
