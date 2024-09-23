import { Module } from '@nestjs/common';
import { AbilitiesModule } from '../../entities/abilities/abilities.module';
import { AbilityService } from './ability.service';

@Module({
  imports: [AbilitiesModule],
  providers: [AbilityService],
  exports: [AbilityService],
})
export class AbilityModule {}
