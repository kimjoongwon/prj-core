import { PartialType } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto';
import { StringField } from 'src/shared/decorators';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {
  @StringField()
  id: string;
}
