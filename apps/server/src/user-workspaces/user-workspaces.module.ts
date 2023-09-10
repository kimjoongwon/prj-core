import { Module } from '@nestjs/common';
import { UserWorkspacesService } from './user-workspaces.service';
import { UserWorkspacesResolver } from './user-workspaces.resolver';

@Module({
  providers: [UserWorkspacesResolver, UserWorkspacesService]
})
export class UserWorkspacesModule {}
