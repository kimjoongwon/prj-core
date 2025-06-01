import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService, LocalStrategy, PasswordService, TokenService } from '@shared';

@Module({
  providers: [AuthService, PasswordService, TokenService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
