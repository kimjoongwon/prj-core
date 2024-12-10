import { Module, OnModuleInit } from '@nestjs/common';
import { InitService } from './init.service';
import {
  PagesModule,
  RolesModule,
  SpacesModule,
  SubjectsModule,
  TenantsModule,
  UsersModule,
} from '../../entities';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from '../password';
import { ServicesModule } from '../../entities/services';
import { CategoriesModule } from '../../entities/categories/categories.module';

@Module({
  imports: [
    RolesModule,
    SpacesModule,
    UsersModule,
    SubjectsModule,
    PagesModule,
    ServicesModule,
    CategoriesModule,
    TenantsModule,
  ],
  providers: [InitService, ConfigService, PasswordService],
  exports: [InitService],
})
export class InitModule implements OnModuleInit {
  constructor(private readonly initService: InitService) {}
  async onModuleInit() {
    await this.initService.initApp();
  }
}
