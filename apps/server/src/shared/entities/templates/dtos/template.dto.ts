import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Template } from '../template.entity';
import { ClassField, EnumField, UUIDField } from '../../../decorators/field.decorators';
import { PostDto } from '../../posts';
import { PartialType } from '@nestjs/swagger';

class Post extends PartialType(PostDto) {}

export class TemplateDto extends AbstractDto implements Template {
  @UUIDField()
  postId: string;

  @EnumField(() => $Enums.TemplateNames)
  name: $Enums.TemplateNames;

  @ClassField(() => Post, { nullable: true, required: false })
  post?: Post;
}
