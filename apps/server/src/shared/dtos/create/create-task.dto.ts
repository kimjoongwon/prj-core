import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { TaskDto } from '../task.dto';
import { CreateContentDto } from './create-content.dto';
import { ClassField } from '../../decorators';

export class CreateTaskDto extends OmitType(TaskDto, [...COMMON_ENTITY_FIELDS, 'contentId']) {
  @ClassField(() => CreateContentDto)
  content: CreateContentDto;
}
