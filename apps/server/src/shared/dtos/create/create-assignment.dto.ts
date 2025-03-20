import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { AssignmentDto } from '../assignment.dto';

export class CreateAssignmentDto extends OmitType(AssignmentDto, [
  ...COMMON_ENTITY_FIELDS,
  'role',
  'tenant',
]) {}
