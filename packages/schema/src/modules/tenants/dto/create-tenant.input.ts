import { InputType, OmitType } from '@nestjs/graphql';
import { BASE_FIELDS } from '../../../common/constants';
import { Tenant } from '../models/tenant.model';

@InputType()
export class CreateTenantInput extends OmitType(
  Tenant,
  [...BASE_FIELDS, 'role', 'space', 'user'],
  InputType,
) {}
