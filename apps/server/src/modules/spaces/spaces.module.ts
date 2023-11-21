import { Module } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { SpacesResolver } from './spaces.resolver';

@Module({
  providers: [SpacesResolver, SpacesService],
  exports: [SpacesService],
})
export class SpacesModule {}
