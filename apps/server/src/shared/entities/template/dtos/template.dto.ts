import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Template } from '../template.entity';
import {
  ClassField,
  EnumField,
  StringField,
  UUIDField,
} from '../../../decorators/field.decorators';
import { Post } from '@nestjs/common';
import { PostDto } from '../../post';

export class TemplateDto extends AbstractDto implements Template {
  @UUIDField()
  postId: string;

  @EnumField(() => $Enums.TemplateNames)
  name: $Enums.TemplateNames;

  @StringField()
  htmlContent: string;

  @UUIDField()
  serviceId: string;

  @ClassField(() => PostDto, { nullable: true })
  post?: PostDto;
}
