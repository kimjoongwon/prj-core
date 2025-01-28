import { Module } from '@nestjs/common';
import { TenanciesPage } from '../pages/tenancies.page';
import { TenanciesRoute } from '../routes/tenancies.route';
import { TenancyTable } from '../tables/tenancy.table';
import { TenancyColumns } from '../columns';

@Module({
  providers: [TenanciesRoute, TenanciesPage, TenancyTable, TenancyColumns],
  exports: [TenanciesRoute],
})
export class TenanciesRouteModule {}
