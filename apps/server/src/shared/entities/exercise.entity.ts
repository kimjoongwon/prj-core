import { AbstractEntity } from './abstract.entity';
import { Exercise as ExcerciseEntity, Task } from '@prisma/client';
import { UseDto } from '../decorators/use-dto.decorator';
import { ExerciseDto } from '../dtos/exercise.dto';

@UseDto(ExerciseDto)
export class Exercise extends AbstractEntity<ExerciseDto> implements ExcerciseEntity {
  duration: number;
  count: number;
  taskId: string;
  task: Task;
}
