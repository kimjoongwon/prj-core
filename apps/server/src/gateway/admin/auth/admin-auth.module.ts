import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth.controller';
import { AuthController, AuthModule } from '@shared';
import { AdminAuthService } from './admin-auth.service';
import { EmailModule } from '../../../shared/domains/email/email.module';

@Module({
  imports: [AuthModule, EmailModule],
  controllers: [AdminAuthController, AuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
