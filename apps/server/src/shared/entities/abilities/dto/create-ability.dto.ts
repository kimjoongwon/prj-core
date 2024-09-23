import { OmitType } from '@nestjs/swagger';
import { AbilityDto } from './ability.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants/entity-common-fields';

export class CreateAbilityDto extends OmitType(AbilityDto, [...COMMON_ENTITY_FIELDS, 'subject']) {}
