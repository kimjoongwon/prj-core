import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constant';
import { TaskDto } from '../task.dto';
import { CreateContentDto } from './create-content.dto';
import { ClassField } from '../../decorator';

export class CreateTaskDto extends OmitType(TaskDto, [...COMMON_ENTITY_FIELDS]) {
  @ClassField(() => CreateContentDto)
  content: CreateContentDto;
}
