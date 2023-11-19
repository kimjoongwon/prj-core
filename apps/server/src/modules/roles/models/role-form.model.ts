import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { CreateRoleInput } from '../dto/create-role.input';
import { $Enums } from '@coc/db';
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
      name: '유저',
      value: $Enums.Roles.USER,
    },
    {
      name: '슈퍼매니져',
      value: $Enums.Roles.SUPER_ADMIN,
    },
  ],
};
