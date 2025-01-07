import { Tenant } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { UserDto, SpaceDto } from '.';
import { ClassField, StringField, UUIDField } from '../decorators/field.decorators';

export class TenantDto extends AbstractDto implements Tenant {
  @UUIDField()
  roleId: string;

  @StringField()
  userId: string;

  @StringField()
  spaceId: string;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto;

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;
}
