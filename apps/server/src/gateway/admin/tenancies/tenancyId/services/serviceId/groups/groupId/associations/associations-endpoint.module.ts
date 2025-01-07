import { Module } from '@nestjs/common';
import { AssociationsController, AssociationsRepository, AssociationsService } from '@shared';

@Module({
  providers: [AssociationsService, AssociationsRepository],
  controllers: [AssociationsController],
})
export class AssociationsEndpointModule {}
