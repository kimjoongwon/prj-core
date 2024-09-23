import { OmitType } from '@nestjs/swagger';
import { TenantDto } from '.';
import { COMMON_ENTITY_FIELDS } from '../../../constants';

export class CreateTenantDto extends OmitType(TenantDto, [
  ...COMMON_ENTITY_FIELDS,
  'tenancy',
  'role',
  'user',
]) {}
