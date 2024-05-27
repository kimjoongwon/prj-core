import { Module } from '@nestjs/common';
import { GroupsService } from '../../../shared/entities/services/groups/groups.service';
import { GroupsController } from './groups.controller';
import { GroupRepository } from 'src/shared/entities/repositories/group/group.repository';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, GroupRepository],
})
export class GroupsModule {}
