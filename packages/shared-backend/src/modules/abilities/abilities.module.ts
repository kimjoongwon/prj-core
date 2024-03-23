import { Module } from '@nestjs/common';
import { AbilitiesService } from './abilities.service';

@Module({
  providers: [AbilitiesService],
})
export class AbilitiesModule {}
