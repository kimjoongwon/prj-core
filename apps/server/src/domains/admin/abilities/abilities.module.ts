import { Module } from '@nestjs/common';
import { AbilityModule } from '@shared';

@Module({
  imports: [AbilityModule],
  controllers: [],
})
export class AbilitiesModule {}
