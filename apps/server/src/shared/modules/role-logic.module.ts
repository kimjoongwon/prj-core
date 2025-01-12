import { Module } from '@nestjs/common';
import { RolesRepository } from '../repositories/role.repository';
import { RolesService } from '../services/roles.service';

@Module({
  providers: [RolesService, RolesRepository],
  exports: [RolesService],
})
export class RoleLogicModule {}
