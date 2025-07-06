import { Module } from '@nestjs/common';
import { AuthController, AuthService, LocalStrategy, PasswordService, TokenService } from '@shared';

@Module({
  providers: [AuthService, PasswordService, TokenService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
