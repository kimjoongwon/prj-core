import { Subject } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { StringField } from '../decorators/field.decorators';

export class SubjectDto extends AbstractDto implements Subject {
  @StringField()
  name: string;
}
