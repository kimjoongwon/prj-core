import { Module } from '@nestjs/common';
import { RoleAssociationsController } from '@shared';

@Module({
  controllers: [RoleAssociationsController],
})
export class RoleAssociationsModule {}
