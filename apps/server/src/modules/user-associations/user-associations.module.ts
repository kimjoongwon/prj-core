import { Module } from '@nestjs/common';
import { UserAssociationsController, UserAssociationsRepository, UserAssociationsService } from '../../shared';

@Module({
  controllers: [UserAssociationsController],
  providers: [UserAssociationsService, UserAssociationsRepository],
})
export class UserAssociationsModule {}
