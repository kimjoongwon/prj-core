import { Module } from '@nestjs/common';
import { AbilitiesService } from '../../../shared/entities/abilities/abilities.service';
import { AbilitiesController } from './abilities.controller';

@Module({
  controllers: [AbilitiesController],
  providers: [AbilitiesService],
})
export class AbilitiesModule {}
