import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth.controller';
import { AuthController, AuthModule } from '@shared';
import { AdminAuthService } from './admin-auth.service';

@Module({
  imports: [AuthModule],
  controllers: [AdminAuthController, AuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
