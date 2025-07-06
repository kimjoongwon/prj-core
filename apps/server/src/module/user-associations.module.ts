import { Module } from '@nestjs/common';
import { UserAssociationsController } from '@shared';

@Module({
  controllers: [UserAssociationsController],
})
export class UserAssociationsModule {}
