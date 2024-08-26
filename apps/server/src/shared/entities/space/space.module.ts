import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceRepository } from './space.repository';

@Module({
  providers: [SpaceService, SpaceRepository],
  exports: [SpaceService],
})
export class SpaceModule {}
