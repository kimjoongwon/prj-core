import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupsModule } from '../../entities/groups/groups.module';

@Module({
  imports: [GroupsModule],
  providers: [GroupService],
  exports: [GroupService],
})
export class AbilityModule {}
