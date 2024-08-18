import { Module } from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { TenancyRepository } from './tenancy.repository';

@Module({
  providers: [TenancyService, TenancyRepository],
  exports: [TenancyService],
})
export class TenancyModule {}
