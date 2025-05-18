import { Subject } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { StringField, UUIDField } from '../decorator/field.decorators';

export class SubjectDto extends AbstractDto implements Subject {
  @UUIDField()
  tenantId: string;
  @StringField()
  name: string;
}
