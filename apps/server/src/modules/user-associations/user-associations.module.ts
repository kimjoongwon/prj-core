import { Module } from '@nestjs/common';
import { UserAssociationsController, UserAssociationsRepository, UserAssociationsService } from '@shared/backend';

@Module({
  controllers: [UserAssociationsController],
  providers: [UserAssociationsService, UserAssociationsRepository],
})
export class UserAssociationsModule {}
