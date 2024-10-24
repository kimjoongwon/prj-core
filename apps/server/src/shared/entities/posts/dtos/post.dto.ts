import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Post } from '../post.entity';
import {
  ClassField,
  EnumField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '../../../decorators/field.decorators';
import { UserDto } from '../../users';

export class PostDto extends AbstractDto implements Post {
  @StringFieldOptional()
  description: string;

  @StringFieldOptional()
  thumbnailUrl: string;

  @StringFieldOptional({ each: true })
  imageUrls: string[];

  @EnumField(() => $Enums.PostTypes)
  type: $Enums.PostTypes;

  @StringField()
  title: string;

  @StringField()
  content: string;

  @UUIDField()
  authorId: string;

  @ClassField(() => UserDto, { nullable: true, each: true, required: false })
  author?: UserDto;
}
