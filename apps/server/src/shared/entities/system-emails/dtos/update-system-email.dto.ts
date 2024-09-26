import { PartialType } from '@nestjs/swagger';
import { CreateSystemEmailDto } from './create-system-email.dto';
import { StringField } from '../../../decorators/field.decorators';

export class UpdateSystemEmailDto extends PartialType(CreateSystemEmailDto) {
  @StringField()
  id: string;
}
