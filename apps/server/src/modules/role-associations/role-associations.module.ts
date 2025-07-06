import { Module } from '@nestjs/common';
import { RoleAssociationsController, RoleAssociationsRepository, RoleAssociationsService } from '../../shared';

@Module({
  controllers: [RoleAssociationsController],
  providers: [RoleAssociationsService, RoleAssociationsRepository],
})
export class RoleAssociationsModule {}
