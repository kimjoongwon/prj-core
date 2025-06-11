import { Module } from '@nestjs/common';
import { AppBuilderController } from './app-builder.controller';
import { AppBuilderService } from './app-builder.service';
import { AuthModule } from '../auth/auth.module';
import { TenantsPage } from './components/pages/tenants.page';
import { DashboardPage } from './components/pages/dashboard.page';
import { UsersPage } from './components/pages/users.page';

@Module({
  imports: [AuthModule],
  providers: [AppBuilderService, TenantsPage, DashboardPage, UsersPage],
  controllers: [AppBuilderController],
})
export class AppBuilderModule {}
