import { Global, Module } from '@nestjs/common';
import { CategoriesPage } from './categories.page';
import { GroupsPage } from './groups.page';
import { LoginPage } from './login.page';
import { GroundsPage } from './grounds.page';
import { TenantsPage } from './tenants.page';
import { DashboardPage } from './dashboard.page';
const modules = [CategoriesPage, GroupsPage, LoginPage, GroundsPage, TenantsPage, DashboardPage];
@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class PagesModule {}
