import { Tenant } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ClassField, StringField } from '../decorators/field.decorators';
import { UserDto } from './user.dto';
import { SpaceDto } from './space.dto';

export class TenantDto extends AbstractDto implements Tenant {
  @StringField()
  userId: string;

  @StringField()
  spaceId: string;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto;

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;
}
