import { Module } from '@nestjs/common';
import {
  ClassificationsController,
  ClassificationsRepository,
  ClassificationsService,
} from '@shared';

@Module({
  providers: [ClassificationsService, ClassificationsRepository],
  controllers: [ClassificationsController],
})
export class ClassificationsEndpointModule {}
