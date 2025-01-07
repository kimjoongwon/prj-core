import { Module } from '@nestjs/common';
import { PasswordService } from '../password';
import { TokenService } from '../token';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies';
import { UsersService } from '../../services';
import { UsersRepository } from '../../repositories';

@Module({
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    LocalStrategy,
    UsersService,
    UsersRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
