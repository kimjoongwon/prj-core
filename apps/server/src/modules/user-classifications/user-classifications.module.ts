import { Module } from '@nestjs/common';
import { UserClassificationsController } from '@shared/backend';

@Module({
  controllers: [UserClassificationsController],
})
export class UserClassificationsModule {}
