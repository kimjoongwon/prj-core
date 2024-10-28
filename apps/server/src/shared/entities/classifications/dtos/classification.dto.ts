import { ClassField, UUIDField } from '../../../decorators';
import { CategoryDto } from '../../categories';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { SpaceDto } from '../../spaces/dtos/space.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { Classification } from '../classification.entity';

export class ClassificationDto extends AbstractDto implements Classification {
  @UUIDField({ nullable: true })
  postId: string | null;

  @UUIDField({ nullable: true })
  depotFileId: string | null;

  @UUIDField({ nullable: true })
  userId: string | null;

  @UUIDField({ nullable: true })
  spaceId: string;

  @UUIDField()
  categoryId: string;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto;

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;

  @ClassField(() => CategoryDto, { required: false })
  category?: CategoryDto;
}
