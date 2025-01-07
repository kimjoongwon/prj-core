import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';
import { TenantDto } from '../tenant.dto';

export class CreateTenantDto extends OmitType(TenantDto, [
  ...COMMON_ENTITY_FIELDS,
  'space',
  'user',
]) {}
