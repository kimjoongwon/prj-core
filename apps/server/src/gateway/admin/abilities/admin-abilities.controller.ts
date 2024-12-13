import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbilityService } from '../../../shared/domains/ability/ability.service';

@ApiTags()
@Controller('ability')
export class AdminAbilityController {
  constructor(private readonly abilityService: AbilityService) {}
}
