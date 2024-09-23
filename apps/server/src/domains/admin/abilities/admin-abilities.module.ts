import { Module } from '@nestjs/common';
import { AbilityModule } from '../../../shared/domains/ability/ability.module';
import { AdminAbilityController } from './admin-abilities.controller';
import { AbilitiesController } from '../../../shared/entities/abilities/abilities.controller';
import { AbilitiesModule } from '@shared';
import { AdminAbilityService } from './admin-abilities.service';

@Module({
  imports: [AbilityModule, AbilitiesModule],
  providers: [AdminAbilityService],
  controllers: [AdminAbilityController, AbilitiesController],
})
export class AdminAbilityModule {}
