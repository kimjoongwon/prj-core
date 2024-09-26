import { Module } from '@nestjs/common';
import { RolesModule, UsersModule } from '../../entities';
import { PasswordService } from '../password';
import { TokenService } from '../token';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies';

@Module({
  imports: [RolesModule, UsersModule],
  providers: [AuthService, PasswordService, TokenService, LocalStrategy],
  exports: [AuthService, TokenService, RolesModule, UsersModule],
})
export class AuthModule {}
