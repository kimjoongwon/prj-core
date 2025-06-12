import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constant';
import { TaskDto } from '../task.dto';

export class CreateTaskDto extends OmitType(TaskDto, [...COMMON_ENTITY_FIELDS]) {}
