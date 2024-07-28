import { Module } from '@nestjs/common';
import { AbilitiesService } from '../../../shared/entities/abilities/abilities.service';
import { AbilitiesController } from './abilities.controller';
import { AbilitiesRepository } from 'src/shared/entities/abilities/abilities.repository';

@Module({
  controllers: [AbilitiesController],
  providers: [AbilitiesService, AbilitiesRepository],
})
export class AbilitiesModule {}
