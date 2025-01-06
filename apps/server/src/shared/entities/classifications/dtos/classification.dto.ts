import { Classification } from '@prisma/client';
import { ClassField, UUIDField } from '../../../decorators';
import { CategoryDto } from '../../categories';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { PostDto } from '../../posts';
import { RoleDto } from '../../roles/dto/';
import { SpaceDto } from '../../spaces/dtos/space.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { ServiceDto } from '../../services/dtos/service.dto';

export class ClassificationDto extends AbstractDto implements Classification {
  @UUIDField({ nullable: true, default: null })
  userId: string | null;

  @UUIDField({ nullable: true, default: null })
  postId: string | null;

  @UUIDField({ nullable: true, default: null })
  spaceId: string | null;

  @UUIDField({ nullable: true, default: null })
  roleId: string | null;

  @UUIDField()
  categoryId: string;

  @UUIDField()
  serviceId: string;

  @ClassField(() => CategoryDto, { required: false })
  category?: CategoryDto;

  @ClassField(() => RoleDto, { required: false })
  role?: RoleDto;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto;

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;

  @ClassField(() => PostDto, { required: false })
  post?: PostDto;

  @ClassField(() => ServiceDto, { required: false })
  service?: ServiceDto;
}
