import { Module } from '@nestjs/common';
import { ServiceAuthController } from './service-auth.controller';
import { ServiceAuthService } from './service-auth.service';
import { EmailModule, RolesModule, SystemEmailsModule } from '@shared';

@Module({
  imports: [EmailModule, RolesModule, SystemEmailsModule],
  controllers: [ServiceAuthController],
  providers: [ServiceAuthService],
})
export class ServiceAuthModule {}
