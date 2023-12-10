import { InputType, OmitType } from '@nestjs/graphql';
import { BASE_FIELDS } from '../../../common/constants';
import { TenantEntity } from '../models/tenant.entity';

@InputType()
export class CreateTenantInput extends OmitType(
  TenantEntity,
  [...BASE_FIELDS],
  InputType,
) {}
