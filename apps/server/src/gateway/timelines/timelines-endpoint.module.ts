import { Module } from '@nestjs/common';
import { TimelineLogicModule, TimelinesController } from '@shared';

@Module({
  imports: [TimelineLogicModule],
  controllers: [TimelinesController],
})
export class TimelinesEndpointModule {}
