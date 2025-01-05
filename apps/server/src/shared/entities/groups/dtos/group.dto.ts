import { Group } from '@prisma/client';
import { ClassField, StringField } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { UserDto } from '../../users';
import { SpaceDto } from '../../spaces';

export class GroupDto extends AbstractDto implements Group {
  @StringField()
  spaceId: string;

  @StringField()
  id: string;

  @StringField()
  name: string;

  @StringField()
  serviceId: string;

  @ClassField(() => SpaceDto)
  space: SpaceDto;

  @ClassField(() => UserDto)
  users: UserDto[];
}
