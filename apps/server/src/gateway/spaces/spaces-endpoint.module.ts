import { Module } from '@nestjs/common';
import { SpacesController, SpacesRepository, SpacesService } from '@shared';

@Module({
  providers: [SpacesService, SpacesRepository],
  controllers: [SpacesController],
})
export class SpacesEndpointModule {}
