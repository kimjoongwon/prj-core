import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {
  AssociationsRepository,
  AssociationsService,
  UsersRepository,
  UsersService,
} from '../../entities';

@Module({
  providers: [
    UserService,
    UsersService,
    AssociationsService,
    UsersRepository,
    AssociationsRepository,
  ],
  exports: [UserService, UsersService],
})
export class UserModule {}
