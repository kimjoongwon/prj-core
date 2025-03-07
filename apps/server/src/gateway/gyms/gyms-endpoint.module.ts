import { Module } from '@nestjs/common';
import { GymsController, GymsRepository, GymsService } from '@shared';

@Module({
  providers: [GymsService, GymsRepository],
  controllers: [GymsController],
})
export class GymsEndpointModule {}
