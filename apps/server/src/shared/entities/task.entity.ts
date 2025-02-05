import { UseDto } from '../decorators/use-dto.decorator';
import { TaskDto } from '../dtos/task.dto';
import { AbstractEntity } from './abstract.entity';
import { Task as TaskEntity } from '@prisma/client';

@UseDto(TaskDto)
export class Task extends AbstractEntity<TaskDto> implements TaskEntity {
  tenancyId: string;
  name: string;
  label: string;
  routineId: string;
  contentId: string;
}
