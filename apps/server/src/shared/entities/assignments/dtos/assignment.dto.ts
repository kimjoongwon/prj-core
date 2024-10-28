import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Assignment } from '../assignment.entity';
import { ClassField, UUIDField } from '../../../decorators/field.decorators';
import { UserDto } from '../../users/dtos/user.dto';
import { GroupDto } from '../../groups/dtos/group.dto';
import { SpaceDto } from '../../spaces/dtos/space.dto';

export class AssignmentDto extends AbstractDto implements Assignment {
  @UUIDField({ nullable: true })
  postId: string | null;

  @UUIDField({ nullable: true })
  depotFileId: string | null;

  @UUIDField({ nullable: true })
  spaceId: string | null;

  @UUIDField({ nullable: true })
  userId: string | null;

  @UUIDField({ nullable: true })
  groupId: string | null;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto;

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;

  @ClassField(() => GroupDto, { required: false })
  group?: GroupDto;
}
