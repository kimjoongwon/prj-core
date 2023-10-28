import { Module } from '@nestjs/common';
import { UserServicesService } from './user-services.service';
import { UserServicesResolver } from './user-services.resolver';

@Module({
  providers: [UserServicesResolver, UserServicesService],
})
export class UserServicesModule {}
