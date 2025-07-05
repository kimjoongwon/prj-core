import { Module } from '@nestjs/common';
import { SpacesController, SpacesRepository, SpacesService } from '@shared/backend';

@Module({
  providers: [SpacesService, SpacesRepository],
  controllers: [SpacesController],
})
export class SpacesModule {}
