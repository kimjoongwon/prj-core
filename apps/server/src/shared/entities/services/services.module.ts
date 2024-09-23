import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesRepository } from './services.repository';

@Module({
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService],
})
export class ServiceModule {}
