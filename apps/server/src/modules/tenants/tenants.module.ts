import { Module } from '@nestjs/common';
import { TenantsController } from '@shared/backend';

@Module({
  controllers: [TenantsController],
})
export class TenantsModule {}
