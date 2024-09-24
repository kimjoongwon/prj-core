import { Module } from '@nestjs/common';
import { SpacesController } from './spaces.controller';
import { SpacesModule } from '@shared';

@Module({
  imports: [SpacesModule],
  controllers: [SpacesController],
})
export class AdminSpacesModule {}
