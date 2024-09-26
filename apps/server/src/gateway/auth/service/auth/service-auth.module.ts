import { Module } from '@nestjs/common';
import { ServiceAuthController } from './service-auth.controller';
import { ServiceAuthService } from './service-auth.service';
import { EmailModule } from '@shared';

@Module({
  imports: [EmailModule],
  controllers: [ServiceAuthController],
  providers: [ServiceAuthService],
})
export class ServiceAuthModule {}
