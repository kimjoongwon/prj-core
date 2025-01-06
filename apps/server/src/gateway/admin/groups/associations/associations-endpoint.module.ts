import { Module } from '@nestjs/common';
import { AssociationsController, AssociationsModule } from '@shared';
import { AssociationsEndpoint } from './associations.endpoint';

@Module({
  imports: [AssociationsModule],
  controllers: [AssociationsEndpoint, AssociationsController],
})
export class AssociationsEndpointModule {}
