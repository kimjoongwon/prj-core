import { Module } from '@nestjs/common';
import { AppBuilderController } from './app-builder.controller';
import { AppBuilderService } from './app-builder.service';
import { AuthModule } from '../auth/auth.module';
import { TenantsPage } from './components/pages/tenants.page';

@Module({
  imports: [AuthModule],
  providers: [AppBuilderService, TenantsPage],
  controllers: [AppBuilderController],
})
export class AppBuilderModule {}
