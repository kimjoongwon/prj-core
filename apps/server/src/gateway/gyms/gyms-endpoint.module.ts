import { Module } from '@nestjs/common';
import { GymsController } from '@shared';

@Module({
  controllers: [GymsController],
})
export class GymsEndpointModule {}
