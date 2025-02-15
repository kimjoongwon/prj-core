import { OmitType } from '@nestjs/swagger';
import { AbilityDto } from '../ability.dto';
import { COMMON_ENTITY_FIELDS } from '../../constants';

export class CreateAbilityDto extends OmitType(AbilityDto, [...COMMON_ENTITY_FIELDS, 'tenant']) {}
