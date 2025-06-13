import { Module } from '@nestjs/common';
import { AppBuilderController } from './app-builder.controller';
import { AppBuilderService } from './app-builder.service';
import { AuthModule } from '../auth/auth.module';
import { DashboardPage } from './components/pages/dashboard.page';
import { UsersPage } from './components/pages/users.page';
import { TenantSelectPage } from './components/pages/tenant-select.page';
import { GroundsPage } from './components/pages/grounds.page';
import { LoginPage } from './components/pages/login.page';

@Module({
  imports: [AuthModule],
  providers: [
    AppBuilderService,
    LoginPage,
    TenantSelectPage,
    DashboardPage,
    UsersPage,
    GroundsPage,
  ],
  controllers: [AppBuilderController],
})
export class AppBuilderModule {}
