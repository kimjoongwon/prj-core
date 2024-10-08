import { OmitType } from '@nestjs/swagger';
import { AssignmentDto } from './assignment.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateAssignmentDto extends OmitType(AssignmentDto, [...COMMON_ENTITY_FIELDS]) {}
