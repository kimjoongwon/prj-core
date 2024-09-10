import { PartialType } from '@nestjs/swagger';
import { CreateTemplateDto } from './create-template.dto';
import { StringField } from '../../../decorators/field.decorators';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @StringField()
  id: string;
}
