import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Role } from '../role.entity';
import { EnumField } from '../../../decorators/field.decorators';

export class RoleDto extends AbstractDto implements Role {
  @EnumField(() => $Enums.Roles)
  name: $Enums.Roles;

  constructor(role: Role) {
    super(role);
    Object.assign(this, role);
  }
}
