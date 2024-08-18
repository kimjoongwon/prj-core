import { OmitType } from '@nestjs/swagger';
import { TenantDto } from './tenant.dto';

export class UpsertTenantDto extends OmitType(TenantDto, [
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
  'tenancy',
  'role',
]) {}
