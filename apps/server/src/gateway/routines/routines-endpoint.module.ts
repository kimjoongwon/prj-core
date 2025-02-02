import { Module } from '@nestjs/common';
import { RoutinesController, RoutineService } from '@shared';

@Module({
  providers: [RoutineService],
  controllers: [RoutinesController],
})
export class RoutinesEndpointModule {}
