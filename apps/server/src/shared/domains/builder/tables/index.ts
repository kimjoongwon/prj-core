import { Global, Module } from '@nestjs/common';
import { TenancyTable } from './tenancy.table';

@Global()
@Module({
  providers: [TenancyTable],
  exports: [TenancyTable],
})
export class TablesModule {}
