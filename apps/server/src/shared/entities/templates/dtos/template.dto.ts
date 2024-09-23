import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Template } from '../template.entity';
import {
  ClassField,
  EnumField,
  StringField,
  UUIDField,
} from '../../../decorators/field.decorators';
import { PostDto } from '../../posts';

export class TemplateDto extends AbstractDto implements Template {
  @UUIDField()
  postId: string;

  @EnumField(() => $Enums.TemplateNames)
  name: $Enums.TemplateNames;

  @StringField({ each: true, isArray: true, default: [] })
  keys: string[];

  @UUIDField()
  serviceId: string;

  @ClassField(() => PostDto, { nullable: true })
  post?: PostDto;
}
