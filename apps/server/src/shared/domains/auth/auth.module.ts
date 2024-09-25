import { Module } from '@nestjs/common';
import { RolesModule, UsersModule } from '../../entities';
import { PasswordService } from '../password';
import { TokenService } from '../token';
import { AuthService } from './auth.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [RolesModule, UsersModule, EmailModule],
  providers: [AuthService, PasswordService, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
