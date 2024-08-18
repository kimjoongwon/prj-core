import { Module } from '@nestjs/common';
import { AbilityModule } from '@shared';
import { AbilitiesController } from './abilities.controller';

@Module({
  controllers: [AbilitiesController],
  imports: [AbilityModule],
})
export class AbilitiesModule {}
