import { AbstractDto } from '../../common/dtos/abstract.dto';
import { ClassField, UUIDField } from '../../../decorators/field.decorators';
import { GroupDto } from '../../groups/dtos/group.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { ServiceDto } from '../../services/dtos/service.dto';
import { Association } from '@prisma/client';

export class AssociationDto extends AbstractDto implements Association {
  @UUIDField({ nullable: true })
  groupId: string | null;

  @UUIDField({ nullable: true })
  userId: string | null;

  @UUIDField({ nullable: true })
  spaceId: string | null;

  @UUIDField()
  serviceId: string;

  @UUIDField({ nullable: true })
  postId: string | null;

  @ClassField(() => GroupDto, { nullable: true })
  group: GroupDto | null;

  @ClassField(() => UserDto, { nullable: true })
  user: GroupDto | null;

  @ClassField(() => ServiceDto, { nullable: true })
  service: ServiceDto | null;
}
