import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Assignment } from '../assignment.entity';
import { ClassField, UUIDField } from '../../../decorators/field.decorators';
import { UserDto } from '../../users/dtos/user.dto';
import { GroupDto } from '../../groups/dtos/group.dto';
import { SpaceDto } from '../../spaces/dtos/space.dto';

export class AssignmentDto extends AbstractDto implements Assignment {
  @UUIDField()
  spaceId: string;

  @UUIDField()
  userId: string;

  @UUIDField()
  groupId: string;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto;

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;

  @ClassField(() => GroupDto, { required: false })
  group?: GroupDto;
}
