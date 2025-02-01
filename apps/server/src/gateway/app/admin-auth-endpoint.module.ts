import { Module } from '@nestjs/common';
import { AdminAuthRouteController } from '@shared';

@Module({
  controllers: [AdminAuthRouteController],
})
export class AdminAuthRouteEndpointModule {}
