import { Module } from '@nestjs/common';
import { RolesModule, UsersModule } from '../../entities';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../password';
import { TokenService } from '../token';
import { AuthService } from './auth.service';

@Module({
  imports: [RolesModule, UsersModule],
  providers: [AuthService, ConfigService, JwtService, PasswordService, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
