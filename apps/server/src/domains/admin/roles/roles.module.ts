import { Module } from '@nestjs/common';
import { RoleModule } from '@shared';
import { RolesController } from './roles.controller';

@Module({
  imports: [RoleModule],
  controllers: [RolesController],
})
export class RolesModule {}
