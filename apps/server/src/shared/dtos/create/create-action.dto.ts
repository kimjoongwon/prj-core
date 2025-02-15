import { OmitType } from '@nestjs/swagger';
import { ActionDto } from '../action.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants';

export class CreateActionDto extends OmitType(ActionDto, [...COMMON_ENTITY_FIELDS, 'tenant']) {}
