import { Global, Module } from '@nestjs/common';
import { CategoriesPage } from './categories.page';
import { GroupsPage } from './groups.page';
import { LoginPage } from './login.page';
import { GroundsPage } from './grounds.page';
import { TenantsPage } from './tenants.page';
const modules = [CategoriesPage, GroupsPage, LoginPage, GroundsPage, TenantsPage];
@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class PagesModule {}
