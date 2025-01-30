import { Module } from '@nestjs/common';
import { AuthEndpoint } from './auth.endpoint';
import { AuthService, LocalStrategy, PasswordService, TokenService, UsersModule } from '@shared';

@Module({
  imports: [UsersModule],
  providers: [AuthService, PasswordService, TokenService, LocalStrategy],
  controllers: [AuthEndpoint],
})
export class AuthEndpointModule {}
