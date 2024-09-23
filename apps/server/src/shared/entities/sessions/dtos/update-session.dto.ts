import { PartialType } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto';
import { StringField } from '../../../decorators/field.decorators';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {
  @StringField()
  id: string;
}
