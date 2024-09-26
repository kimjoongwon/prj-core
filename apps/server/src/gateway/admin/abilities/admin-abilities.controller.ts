import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbilityService } from '../../../shared/domains/ability/ability.service';
import { AbilitiesService } from '../../../shared/entities/abilities/abilities.service';

@ApiTags()
@Controller('ability')
export class AdminAbilityController {
  constructor(
    private readonly abilityService: AbilityService,
    private readonly abilitiesService: AbilitiesService,
  ) {}
}
