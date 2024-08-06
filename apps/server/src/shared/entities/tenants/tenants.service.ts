import { Injectable } from '@nestjs/common';
import { UpsertTenantDto } from './dtos/upsert-tenant.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}
  createOrUpdate(upsertTenantDto: UpsertTenantDto) {
    const { userId, tenancyId } = upsertTenantDto;
    return this.prisma.tenant.upsert({
      where: {
        userId,
        tenancyId,
      },
      create: upsertTenantDto,
      update: upsertTenantDto,
    });
  }
}
