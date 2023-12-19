import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { CreateRoleInput } from '../dto/create-role.input';
import { $Enums } from '@prisma/client';
import { Option } from '../../../common/models';
@ObjectType()
export class RoleForm extends PartialType(CreateRoleInput, ObjectType) {
  @Field(type => [Option])
  options: Option[];
}

export const defaultRoleForm: RoleForm = {
  name: $Enums.Roles.USER,
  options: [
    {
      text: '유저',
      value: $Enums.Roles.USER,
    },
    {
      text: '슈퍼매니져',
      value: $Enums.Roles.SUPER_ADMIN,
    },
  ],
};
