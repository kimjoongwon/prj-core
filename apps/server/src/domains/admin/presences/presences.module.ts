import { Module } from '@nestjs/common';
import { PresencesController } from './presences.controller';
import { PresencesRepository, PresencesService } from '@shared';

@Module({
  controllers: [PresencesController],
  providers: [PresencesService, PresencesRepository],
})
export class PresencesModule {}
