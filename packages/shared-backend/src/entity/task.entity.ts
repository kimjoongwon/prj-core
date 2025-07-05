import { UseDto } from '../decorator/use-dto.decorator';
import { TaskDto } from '../dto/task.dto';
import { AbstractEntity } from './abstract.entity';
import { Task as TaskEntity } from '@prisma/client';

@UseDto(TaskDto)
export class Task extends AbstractEntity<TaskDto> implements TaskEntity {
  tenantId: string;
}
