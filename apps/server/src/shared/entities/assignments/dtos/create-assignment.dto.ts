import { OmitType } from '@nestjs/swagger';
import { AssignmentDto } from './assignment.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';
import { ClassField } from '../../../decorators';

export class CreateAssignmentDto extends OmitType(AssignmentDto, [
  ...COMMON_ENTITY_FIELDS,
  'group',
  'space',
  'user',
]) {}

export class CreateAssignmentDtos {
  @ClassField(() => CreateAssignmentDto, { each: true, isArray: true })
  items: CreateAssignmentDto[];
}
