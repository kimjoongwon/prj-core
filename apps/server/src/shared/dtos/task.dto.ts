import { Task as TaskEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { StringField, UUIDField } from '../decorators';

export class TaskDto extends AbstractDto implements TaskEntity {
  @StringField()
  name: string;

  @StringField()
  label: string;

  @UUIDField()
  routineId: string;

  @UUIDField()
  contentId: string;
}
