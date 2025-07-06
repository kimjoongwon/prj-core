import { Module } from '@nestjs/common';
import { RoutinesController } from '../../shared';

@Module({
  controllers: [RoutinesController],
})
export class RoutinesModule {}
