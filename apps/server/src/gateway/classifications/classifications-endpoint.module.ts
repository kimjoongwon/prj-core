import { Module } from '@nestjs/common';
import { ClassificationsController } from '@shared';

@Module({
  controllers: [ClassificationsController],
})
export class ClassificationsEndpointModule {}
