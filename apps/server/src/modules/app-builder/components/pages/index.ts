import { Global, Module } from '@nestjs/common';
import { LoginPage } from './login.page';
import { WorkspaceSelectPage } from './workspace-select.page';
import { UsersPage } from './users.page';
import { DashboardPage } from './dashboard.page';

const modules = [LoginPage, WorkspaceSelectPage, UsersPage, DashboardPage];
@Global()
@Module({
  providers: modules,
  exports: modules,
})
export class PagesModule {}
