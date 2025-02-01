import { Module } from '@nestjs/common';
import { AuthEndpoint } from './auth.endpoint';
import { AuthService, LocalStrategy, PasswordService, TokenService } from '@shared';

@Module({
  providers: [AuthService, PasswordService, TokenService, LocalStrategy],
  controllers: [AuthEndpoint],
})
export class AuthEndpointModule {}
