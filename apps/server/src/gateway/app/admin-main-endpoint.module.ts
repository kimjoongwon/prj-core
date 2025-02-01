import { Module } from '@nestjs/common';
import { AdminMainRouteController } from '@shared';

@Module({
  controllers: [AdminMainRouteController],
})
export class AdminMainRouteEndpointModule {}
