import { Global, Module } from '@nestjs/common';
import { LoginPage } from './login.page';
import { TenantSelectPage } from './tenant-select.page';
import { UsersPage } from './users.page';
import { DashboardPage } from './dashboard.page';
import { GroundsPage } from './grounds.page';

const modules = [LoginPage, TenantSelectPage, UsersPage, DashboardPage, GroundsPage];
@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class PagesModule {}
