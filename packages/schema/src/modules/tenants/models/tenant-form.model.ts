import { ObjectType, PartialType } from '@nestjs/graphql';
import { CreateTenantInput } from '../dto/create-tenant.input';

@ObjectType()
export class TenantForm extends PartialType(CreateTenantInput, ObjectType) {}

export const tenantForm: TenantForm = {};
