import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Post } from '../post.entity';
import {
  ClassField,
  EnumField,
  StringField,
  UUIDField,
} from '../../../decorators/field.decorators';
import { UserDto } from '../../user';

export class PostDto extends AbstractDto implements Post {
  @EnumField(() => $Enums.PostTypes)
  type: $Enums.PostTypes;

  @StringField()
  title: string;

  @StringField()
  content: string;

  @UUIDField()
  authorId: string;

  @UUIDField()
  serviceId: string;

  @ClassField(() => UserDto, { nullable: true })
  author?: UserDto;
}
