import { Module } from '@nestjs/common';
import { TimelinesController } from '@shared/backend';

@Module({
  controllers: [TimelinesController],
})
export class TimelinesModule {}
