import { SetMetadata } from '@nestjs/common';

export const TENANT_KEY = 'tenant';
export const Tenant = (tenant: string) =>
  SetMetadata(TENANT_KEY, tenant);
