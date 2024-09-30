import { PartialType } from '@nestjs/swagger';
import { CreatePageDto } from './create-page.dto';
import { StringField } from '../../../decorators/field.decorators';

export class UpdatePageDto extends PartialType(CreatePageDto) {
  @StringField()
  id: string;
}
