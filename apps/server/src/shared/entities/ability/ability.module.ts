import { Module } from '@nestjs/common';
import { AbilityService } from './ability.service';
import { AbilityRepository } from './ability.repository';
import { AbilitiesController } from './ability.controller';

@Module({
  controllers: [AbilitiesController],
  providers: [AbilityService, AbilityRepository],
  exports: [AbilityService, AbilityRepository],
})
export class AbilityModule {}
