import { OmitType, PartialType } from '@nestjs/swagger';
import { TenantDto } from '.';

export class UpdateTenantDto extends OmitType(PartialType(TenantDto), [
  'role',
  'user',
  'tenancy',
]) {}
