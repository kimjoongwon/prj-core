import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import {
  AuthService,
  JwtStrategy,
  LocalStrategy,
  PasswordService,
  TokenService,
} from '@shared/backend';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [AuthService, PasswordService, TokenService, LocalStrategy, JwtStrategy, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
