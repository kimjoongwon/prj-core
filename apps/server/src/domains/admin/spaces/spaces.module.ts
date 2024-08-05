import { Module } from '@nestjs/common';
import { SpacesService } from '@shared';
import { SpacesController } from './spaces.controller';

@Module({
  controllers: [SpacesController],
  providers: [SpacesService],
  exports: [SpacesService],
})
export class SpacesModule {}
