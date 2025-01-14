import { Module } from '@nestjs/common';
import { AbilitiesRepository } from '../repositories/abilities.repository';
import { AbilitiesService } from '../services/abilities.service';

@Module({
  providers: [AbilitiesService, AbilitiesRepository],
  exports: [AbilitiesService],
})
export class AbilityLogicModule {}
