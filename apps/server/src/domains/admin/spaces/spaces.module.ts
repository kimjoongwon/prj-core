import { Module } from '@nestjs/common';
import { SpacesController } from './spaces.controller';
import { SpaceModule } from '@shared';

@Module({
  imports: [SpaceModule],
  controllers: [SpacesController],
})
export class SpacesModule {}
