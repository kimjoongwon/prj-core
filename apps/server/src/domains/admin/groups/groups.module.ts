import { Module } from '@nestjs/common';
import { GroupsService } from '../../../shared/entities/services/groups/groups.service';
import { GroupsController } from './groups.controller';
import { GroupsRepository } from '../../../shared/entities/repositories/groups/groups.repository';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, GroupsRepository],
})
export class GroupsModule {}
