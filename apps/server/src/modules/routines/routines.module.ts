import { Module } from '@nestjs/common';
import { RoutinesController } from '@shared/backend';

@Module({
  controllers: [RoutinesController],
})
export class RoutinesModule {}
