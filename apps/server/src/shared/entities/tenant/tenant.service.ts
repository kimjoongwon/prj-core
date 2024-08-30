import { Injectable } from '@nestjs/common';
import { UpsertTenantDto } from './dtos/upsert-tenant.dto';
import { TenantRepository } from './tenant.repository';
@Injectable()
export class TenantService {
  constructor(private readonly repository: TenantRepository) {}

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
