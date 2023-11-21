import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Tenant } from '../models/tenant.model';
import { BASE_FIELDS } from '../../../common/constants';

@InputType()
export class CreateTenantInput extends OmitType(
  Tenant,
  [...BASE_FIELDS, 'role', 'space', 'user'],
  InputType,
) {}
