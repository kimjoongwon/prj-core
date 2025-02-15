import { OmitType } from '@nestjs/swagger';
import { RoutineDto } from '../routine.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants/entity-common-fields';

export class CreateRoutineDto extends OmitType(RoutineDto, [...COMMON_ENTITY_FIELDS, 'content']) {}
