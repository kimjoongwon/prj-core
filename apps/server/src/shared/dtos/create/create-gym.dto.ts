import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../constants';
import { GymDto } from '../gym.dto';

export class CreateGymDto extends OmitType(GymDto, [...COMMON_ENTITY_FIELDS]) {}
