import { Module } from '@nestjs/common';
import { SpaceClassificationsController } from '@shared/backend';

@Module({
  controllers: [SpaceClassificationsController],
})
export class SpaceClassificationsModule {}
