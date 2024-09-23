import { Module } from '@nestjs/common';
import { ServiceAuthController } from './service-auth.controller';
import { AuthController, AuthModule } from '@shared';
import { ServiceAuthService } from './service-auth.service';

@Module({
  imports: [AuthModule],
  controllers: [AuthController, ServiceAuthController],
  providers: [ServiceAuthService],
})
export class ServiceAuthModule {}
