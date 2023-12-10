import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { $Enums, Role as CoCRole } from '@prisma/client';
import { Base } from '../../../common/interfaces';

registerEnumType($Enums.Roles, {
  name: 'RoleEnum',
});

@ObjectType()
@InputType('RoleInputType')
export class Role extends Base implements CoCRole {
  @Field(type => $Enums.Roles)
  name: $Enums.Roles;
}
