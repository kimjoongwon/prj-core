import { Module } from '@nestjs/common';
import { SpaceClassificationsController } from '../../shared';

@Module({
  controllers: [SpaceClassificationsController],
})
export class SpaceClassificationsModule {}
