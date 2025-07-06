import { Module } from '@nestjs/common';
import { SpaceAssociationsController } from '@shared';

@Module({
  controllers: [SpaceAssociationsController],
})
export class SpaceAssociationsModule {}
