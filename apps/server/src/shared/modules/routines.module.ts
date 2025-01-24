import { Module } from '@nestjs/common';
import { RoutinesService } from '../services';
import { RoutinesRepository } from '../repositories';

@Module({
  providers: [RoutinesService, RoutinesRepository],
  exports: [RoutinesService],
})
export class RoutinesModule {}
