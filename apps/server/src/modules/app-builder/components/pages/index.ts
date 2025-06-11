import { Global, Module } from '@nestjs/common';
import { LoginPage } from './login.page';
import { TenantsPage } from './tenants.page';
import { UsersPage } from './users.page';
import { DashboardPage } from './dashboard.page';

const modules = [LoginPage, TenantsPage, UsersPage, DashboardPage];
@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class PagesModule {}
