import { IntersectionType } from '@nestjs/swagger';
import { QueryDto } from './query.dto';
import { UpdateAbilityDto } from '../update';

export class AbilityQueryDto extends IntersectionType(QueryDto, UpdateAbilityDto) {}
