import { AbstractDto } from '../../common/dtos/abstract.dto';
import { RoleDto } from '../../roles';
import { UserDto } from '../../users';
import { SpaceDto } from '../../spaces';
import { BooleanField, ClassField, StringField } from '../../../decorators/field.decorators';
import { Tenant } from '@prisma/client';

export class TenantDto extends AbstractDto implements Tenant {
  @StringField()
  userId: string;

  @StringField()
  roleId: string;

  @StringField()
  spaceId: string;

  @BooleanField()
  active: boolean;

  @ClassField(() => RoleDto, { required: false })
  role?: RoleDto;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto;

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;
}
