import { Module } from '@nestjs/common';
import { AbilityService } from './ability.service';
import { AbilityRepository } from './ability.repository';

@Module({
  providers: [AbilityService, AbilityRepository],
  exports: [AbilityService, AbilityRepository],
})
export class AbilityModule {}
