import { Module } from '@nestjs/common';
import { RoleService } from '@shared';

@Module({
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
