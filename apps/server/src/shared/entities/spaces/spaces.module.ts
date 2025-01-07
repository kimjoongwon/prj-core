import { Module } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { SpacesRepository } from '../../repositories/spaces.repository';

@Module({
  providers: [SpacesService, SpacesRepository],
  exports: [SpacesService],
})
export class SpacesModule {}
