import { Module } from '@nestjs/common';
import { AbilitiesService } from './abilities.service';
import { AbilitiesRepository } from './abilities.repository';

@Module({
  providers: [AbilitiesService, AbilitiesRepository],
  exports: [AbilitiesService, AbilitiesRepository],
})
export class AbilitiesModule {}
