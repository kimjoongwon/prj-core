import { Module } from '@nestjs/common';
import { TimelinesController } from '../../shared';

@Module({
  controllers: [TimelinesController],
})
export class TimelinesModule {}
