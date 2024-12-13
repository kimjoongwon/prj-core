import { Module } from '@nestjs/common';
import { AdminAbilityController } from './admin-abilities.controller';
import { AbilitiesController } from '../../../shared/entities/abilities/abilities.controller';
import { AdminAbilityService } from './admin-abilities.service';
import { AbilitiesModule, AbilityService } from '@shared';

@Module({
  imports: [AbilitiesModule],
  providers: [AdminAbilityService, AbilityService],
  controllers: [AdminAbilityController, AbilitiesController],
})
export class AdminAbilityModule {}
