import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { $Enums, Role as CoCRole } from '@coc/db';
import { Base } from '../../../common/interfaces';

registerEnumType($Enums.Roles, {
  name: 'RoleEnum',
});

@ObjectType()
@InputType('RoleInput')
export class Role extends Base implements CoCRole {
  @Field(type => $Enums.Roles)
  name: $Enums.Roles;
}
