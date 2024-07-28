import { OmitType } from '@nestjs/swagger';
import { Ability } from '../ability.entity';

export class CreateAbilityDto extends OmitType(Ability, ['createdAt', 'updatedAt', 'deletedAt']) {}
