import { Module } from '@nestjs/common';
import { AbilityLogicModule, AbilitiesController } from '@shared';

@Module({
  imports: [AbilityLogicModule],
  controllers: [AbilitiesController],
})
export class AbilitiesEndpointModule {}
