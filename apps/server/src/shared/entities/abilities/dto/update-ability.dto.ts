import { OmitType, PartialType } from '@nestjs/swagger';
import { AbilityDto } from './ability.dto';

export class UpdateAbilityDto extends PartialType(OmitType(AbilityDto, ['subject'])) {}
