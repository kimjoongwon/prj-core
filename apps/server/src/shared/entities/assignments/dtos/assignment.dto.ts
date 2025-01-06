import { AbstractDto } from '../../common/dtos/abstract.dto';
import { ClassField, UUIDField } from '../../../decorators/field.decorators';
import { GroupDto } from '../../groups/dtos/group.dto';
import { Assignment } from '@prisma/client';

export class AssignmentDto extends AbstractDto implements Assignment {
  @UUIDField({ nullable: true })
  groupId: string | null;

  @UUIDField({ nullable: true })
  userId: string | null;

  @UUIDField({ nullable: true })
  spaceId: string | null;

  @UUIDField({ nullable: true })
  postId: string | null;

  @ClassField(() => GroupDto, { required: false })
  group?: GroupDto;
}
