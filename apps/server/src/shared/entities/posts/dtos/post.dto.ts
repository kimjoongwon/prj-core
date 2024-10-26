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
import { UserDto } from '../../users/dtos/user.dto';

export class PostDto extends AbstractDto implements Post {
  @StringFieldOptional({ nullable: true })
  thumbnailImgUrl: string | null;

  @StringFieldOptional({ each: true })
  imgUrls: string[];

  @StringFieldOptional()
  description: string;

  @EnumField(() => $Enums.PostTypes)
  type: $Enums.PostTypes;

  @StringField()
  title: string;

  @StringField()
  content: string;

  @UUIDField()
  authorId: string;

  @ClassField(() => UserDto, { required: false })
  author?: UserDto;
}
