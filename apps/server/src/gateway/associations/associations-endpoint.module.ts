import { Module } from '@nestjs/common';
import { AssociationsController, AssociationsRepository, AssociationsService } from '@shared';

@Module({
  controllers: [AssociationsController],
  providers: [AssociationsService, AssociationsRepository],
})
export class AssociationsEndpointModule {}
