import { UseDto } from '../decorators/use-dto.decorator';
import { TaskDto } from '../dtos/task.dto';
import { AbstractEntity } from './abstract.entity';
import { Task as TaskEntity } from '@prisma/client';

@UseDto(TaskDto)
export class Task extends AbstractEntity<TaskDto> implements TaskEntity {
  name: string;
  label: string;
  tenancyId: string;
  routineId: string;
  contentId: string;
}
