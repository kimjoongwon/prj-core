import { PartialType } from '@nestjs/swagger';
import { CreateEmailDto } from './create-email.dto';
import { StringField } from '../../../decorators/field.decorators';

export class UpdateEmailDto extends PartialType(CreateEmailDto) {
  @StringField()
  id: string;
}
