import { Module } from '@nestjs/common';
import { RoleClassificationsController } from '../../shared';

@Module({
  controllers: [RoleClassificationsController],
})
export class RoleClassificationsModule {}
