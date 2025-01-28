import { Module } from '@nestjs/common';
import { LoginRouteBuilderModule, AdminAuthRouteController } from '@shared';

@Module({
  imports: [LoginRouteBuilderModule],
  controllers: [AdminAuthRouteController],
})
export class AdminAuthRouteEndpointModule {}
