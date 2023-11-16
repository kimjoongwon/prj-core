import { ObjectType, PartialType } from '@nestjs/graphql';
import { CreateTenantInput } from '../dto';

@ObjectType()
export class TenantForm extends PartialType(CreateTenantInput, ObjectType) {}

export const tenantForm = {
  name: '',
};
