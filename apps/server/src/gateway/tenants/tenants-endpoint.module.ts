import { Module } from '@nestjs/common';
import { TenantsController } from '@shared';

@Module({
  controllers: [TenantsController],
})
export class TenantsEndpointModule {}
