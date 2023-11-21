import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { SpacesModule } from '../spaces/spaces.module';
import { RolesModule } from '../roles/roles.module';
import { PasswordService } from '../auth/providers/password.service';

@Module({
  imports: [SpacesModule, RolesModule],
  providers: [UsersResolver, UsersService, PasswordService],
})
export class UsersModule {}
