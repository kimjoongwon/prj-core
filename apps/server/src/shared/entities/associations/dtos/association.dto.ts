import { AbstractDto } from '../../common/dtos/abstract.dto';
import { ClassField, UUIDField } from '../../../decorators/field.decorators';
import { GroupDto } from '../../groups/dtos/group.dto';
import { Association } from '@prisma/client';

export class AssociationDto extends AbstractDto implements Association {
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
