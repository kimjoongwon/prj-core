import { Module } from '@nestjs/common';
import { RoleLogicModule, RolesController } from '@shared';

@Module({
  imports: [RoleLogicModule],
  controllers: [RolesController],
})
export class RolesEndpointModule {}
