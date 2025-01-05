import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {
  AssignmentsRepository,
  AssignmentsService,
  UsersRepository,
  UsersService,
} from '../../entities';

@Module({
  providers: [
    UserService,
    UsersService,
    AssignmentsService,
    UsersRepository,
    AssignmentsRepository,
  ],
  exports: [UserService, UsersService],
})
export class UserModule {}
