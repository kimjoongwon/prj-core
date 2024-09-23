import { OmitType } from '@nestjs/swagger';
import { TenantDto } from './tenant.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants';

export class UpsertTenantDto extends OmitType(TenantDto, [
  ...COMMON_ENTITY_FIELDS,
  'tenancy',
  'role',
  'user',
]) {}
