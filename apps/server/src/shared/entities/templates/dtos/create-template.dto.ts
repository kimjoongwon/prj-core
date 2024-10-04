import { OmitType } from '@nestjs/swagger';
import { TemplateDto } from './template.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';
import { CreatePostDto } from '../../posts';
import { ClassField } from '../../../decorators';

export class CreateTemplateDto extends OmitType(TemplateDto, [
  ...COMMON_ENTITY_FIELDS,
  'post',
  'postId',
]) {
  @ClassField(() => CreatePostDto)
  post: CreatePostDto;
}
