import { Module } from '@nestjs/common';
import { RoleClassificationsController } from '@shared/backend';

@Module({
  controllers: [RoleClassificationsController],
})
export class RoleClassificationsModule {}
