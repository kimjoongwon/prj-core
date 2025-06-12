import { $Enums, Role } from '@prisma/client';
import { EnumField } from '../decorator/field.decorators';
import { AbstractDto } from './abstract.dto';

export class RoleDto extends AbstractDto implements Role {
  @EnumField(() => $Enums.Roles)
  name: $Enums.Roles;
}
