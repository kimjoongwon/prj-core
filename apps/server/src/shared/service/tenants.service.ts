import { Injectable } from '@nestjs/common';
import { TenantsRepository } from '../repository';
import { CreateTenantDto, UpdateTenantDto, QueryTenantDto } from '../dto';
import { BaseService } from './base.service';
import { Tenant } from '../entity';
import { Prisma } from '@prisma/client';

// Define the include type for Tenant with proper type inference
type TenantInclude = Prisma.TenantInclude;
@Injectable()
export class TenantsService extends BaseService<
  CreateTenantDto,
  UpdateTenantDto,
  QueryTenantDto,
  Tenant,
  TenantsRepository,
  TenantInclude
> {
  constructor(repository: TenantsRepository) {
    super(repository, {
      includeMap: {
        getManyByQuery: {
          space: {
            include: {
              ground: true,
            },
          },
        },
      },
    });
  }
}
