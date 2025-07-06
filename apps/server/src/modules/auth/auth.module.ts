import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Module({
  providers: [AuthService, PasswordService, TokenService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
