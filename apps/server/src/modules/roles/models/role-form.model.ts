import { ObjectType, PartialType } from '@nestjs/graphql';
import { CreateRoleInput } from '../dto';

@ObjectType()
export class RoleForm extends PartialType(CreateRoleInput, ObjectType) {}

export const roleForm: RoleForm = {
  name: 'USER',
  accessPages: [],
};
