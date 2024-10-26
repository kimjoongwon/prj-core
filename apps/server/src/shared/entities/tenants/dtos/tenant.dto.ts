import { Tenant } from '../tenant.entity';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { BooleanField, ClassField, StringField } from '../../../decorators/field.decorators';
import { RoleDto } from '../../roles/dto/role.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { SpaceDto } from '../../spaces/dtos/space.dto';
import { ApiProperty } from '@nestjs/swagger';

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
