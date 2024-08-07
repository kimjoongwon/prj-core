import { Module } from '@nestjs/common';
import { TenanciesService } from './tenancies.service';
import { TenanciesRepository } from './tenancies.repository';

@Module({
  providers: [TenanciesService, TenanciesRepository],
  exports: [TenanciesService],
})
export class TenanciesModule {}
