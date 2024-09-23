import { Module } from '@nestjs/common';
import { RolesModule, UsersModule } from '../../entities';
import { PasswordService } from '../password';
import { TokenService } from '../token';
import { AuthService } from './auth.service';

@Module({
  imports: [RolesModule, UsersModule],
  providers: [AuthService, PasswordService, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
