import { Module } from '@nestjs/common';
import { SpaceAssociationsController, SpaceAssociationsRepository, SpaceAssociationsService } from '../../shared';

@Module({
  controllers: [SpaceAssociationsController],
  providers: [SpaceAssociationsService, SpaceAssociationsRepository],
})
export class SpaceAssociationsModule {}
