import { Global, Module } from '@nestjs/common';
import { LoginPage } from './login.page';
import { TenantSelectPage } from './tenant-select.page';
import { UsersPage } from './users.page';
import { DashboardPage } from './dashboard.page';
import { GroundsPage } from './grounds.page';
import { GroundPage } from './ground.page';
import { CategoriesPage } from './categories.page';

const modules = [LoginPage, TenantSelectPage, UsersPage, DashboardPage, GroundsPage, GroundPage, CategoriesPage];
@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class PagesModule {}
