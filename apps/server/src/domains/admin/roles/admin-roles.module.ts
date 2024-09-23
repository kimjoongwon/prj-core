import { Module } from '@nestjs/common';
import { RolesModule } from '@shared';
import { RolesController } from './admin-roles.controller';

@Module({
  imports: [RolesModule],
  controllers: [RolesController],
})
export class AdminRolesModule {}
