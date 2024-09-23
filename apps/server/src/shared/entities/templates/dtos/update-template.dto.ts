import { PartialType } from '@nestjs/swagger';
import { CreateTemplateDto } from './create-template.dto';
import { ClassField, StringField } from '../../../decorators/field.decorators';
import { UpdatePostDto } from '../../posts';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @StringField()
  id: string;

  @ClassField(() => UpdatePostDto)
  updatePostDto: UpdatePostDto;
}
