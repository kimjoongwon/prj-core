import { Module } from '@nestjs/common';
import { ServiceAuthController } from './service-auth.controller';
import { AuthController, AuthModule } from '@shared';
import { ServiceAuthService } from './service-auth.service';
import { EmailModule } from '../../../shared/domains/email/email.module';

@Module({
  imports: [AuthModule, EmailModule],
  controllers: [AuthController, ServiceAuthController],
  providers: [ServiceAuthService],
})
export class ServiceAuthModule {}
