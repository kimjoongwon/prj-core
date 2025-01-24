import { Module } from '@nestjs/common';
import { RoutinesController, RoutinesRepository, RoutinesService } from '@shared';

@Module({
  providers: [RoutinesService, RoutinesRepository],
  controllers: [RoutinesController],
})
export class RoutinesEndpointModule {}
