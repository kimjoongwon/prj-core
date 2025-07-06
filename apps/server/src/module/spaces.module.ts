import { Module } from '@nestjs/common';
import { SpacesController } from '@shared';

@Module({
  controllers: [SpacesController],
})
export class SpacesModule {}
