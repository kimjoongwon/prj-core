import { Exercise as ExcerciesEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { NumberField, UUIDField } from '../decorators';

export class ExerciseDto extends AbstractDto implements Omit<ExcerciesEntity, 'taskId'> {
  @UUIDField()
  taskId: string;

  @NumberField({ default: 0 })
  duration: number;

  @NumberField({ default: 0 })
  count: number;
}
