import { Tenant } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { UserDto, SpaceDto } from '.';
import { BooleanField, ClassField, StringField, UUIDField } from '../decorators/field.decorators';

export class TenantDto extends AbstractDto implements Tenant {
  @BooleanField()
  main: boolean;

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
