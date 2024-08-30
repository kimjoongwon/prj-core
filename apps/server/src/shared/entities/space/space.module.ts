import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceRepository } from './space.repository';
import { TenancyModule } from '../tenancy';

@Module({
  imports: [TenancyModule],
  providers: [SpaceService, SpaceRepository],
  exports: [SpaceService],
})
export class SpaceModule {}
