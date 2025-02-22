import { Exercise as ExcerciesEntity } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ClassField, NumberField, UUIDField } from '../decorators';
import { CreateExerciseDto, CreateTaskDto } from './create';
import { ValidationRecord } from '@shared/types';

export const createDefaultExerciseObject: Omit<CreateExerciseDto, 'task'> = {
  duration: 18,
  count: 0,
};

export const createExerciseValidationObject: Omit<ValidationRecord<CreateExerciseDto>, 'task'> = {
  count: {
    required: {
      value: true,
      message: '운동 횟수는 필수입니다.',
    },
  },
  duration: {
    required: {
      value: true,
      message: '운동 시간은 필수입니다.',
    },
  },
};

export class ExerciseDto extends AbstractDto implements ExcerciesEntity {
  @UUIDField()
  taskId: string;

  @NumberField({
    default: createDefaultExerciseObject.duration,
    errorMessage: createExerciseValidationObject.duration.required.message,
  })
  duration: number;

  @NumberField({
    default: createDefaultExerciseObject.count,
    errorMessage: createExerciseValidationObject.count.required.message,
  })
  count: number;

  @ClassField(() => CreateTaskDto, { required: false })
  task?: CreateTaskDto;
}
