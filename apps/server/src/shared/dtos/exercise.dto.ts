import { Exercise as ExcerciesEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { NumberField, UUIDField } from '../decorators';

export class ExerciseDto extends AbstractDto implements ExcerciesEntity {
  @UUIDField()
  taskId: string;

  @NumberField({ default: 0 })
  duration: number;

  @NumberField({ default: 0 })
  count: number;

  toRdo() {

    return {
      ...this,
      taskId: this.taskId,
      duration: this.duration,
      count: this.count,
    };
  }
}
