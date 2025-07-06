import { Module } from '@nestjs/common';
import { UserClassificationsController } from '../../shared';

@Module({
  controllers: [UserClassificationsController],
})
export class UserClassificationsModule {}
