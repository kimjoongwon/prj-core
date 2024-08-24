import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceRepository } from './service.repository';

@Module({
  providers: [ServiceService, ServiceRepository],
  exports: [ServiceService],
})
export class ServiceModule {}
