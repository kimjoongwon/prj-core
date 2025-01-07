import { Module } from '@nestjs/common';
import { AuthEndpoint } from './auth.endpoint';
import {
  AuthService,
  LocalStrategy,
  PasswordService,
  TokenService,
  UsersRepository,
  UsersService,
} from '@shared';

@Module({
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    LocalStrategy,
    UsersService,
    UsersRepository,
  ],
  controllers: [AuthEndpoint],
})
export class AuthEndpointModule {}
