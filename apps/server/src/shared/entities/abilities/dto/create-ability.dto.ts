import { OmitType } from '@nestjs/swagger';
import { AbilityDto } from './ability.dto';

export class CreateAbilityDto extends OmitType(AbilityDto, [
  'createdAt',
  'updatedAt',
  'deletedAt',
  'id',
]) {}
