import { Module } from '@nestjs/common';
import { TenanciesService } from './tenancies.service';

@Module({
  providers: [TenanciesService],
  exports: [TenanciesService],
})
export class TenanciesModule {}
