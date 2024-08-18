import { Module } from '@nestjs/common';
import { GroupModule } from '@shared';
import { GroupsController } from './groups.controller';

@Module({
  imports: [GroupModule],
  controllers: [GroupsController],
})
export class GroupsModule {}
