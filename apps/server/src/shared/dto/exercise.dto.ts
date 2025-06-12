import { Exercise as ExcerciesEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ClassField, NumberField, StringField, UUIDField, UUIDFieldOptional } from '../decorator';
import { CreateTaskDto } from './create';

export class ExerciseDto extends AbstractDto implements ExcerciesEntity {
  @StringField()
  name: string;

  @StringField()
  description: string;

  @UUIDFieldOptional()
  imageFileId: string;

  @UUIDFieldOptional()
  videoFileId: string;

  @UUIDField()
  taskId: string;

  @NumberField()
  duration: number;

  @NumberField()
  count: number;

  @ClassField(() => CreateTaskDto, { required: false })
  task?: CreateTaskDto;
}
