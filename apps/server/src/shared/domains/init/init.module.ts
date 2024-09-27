import { InternalServerErrorException, Module, OnModuleInit } from '@nestjs/common';
import { InitService } from './init.service';
import {
  RolesModule,
  SpacesModule,
  SubjectsModule,
  TenanciesModule,
  TenantsModule,
  UsersModule,
} from '../../entities';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from '../password';

@Module({
  imports: [RolesModule, SpacesModule, TenanciesModule, UsersModule, SubjectsModule],
  providers: [InitService, ConfigService, PasswordService],
  exports: [InitService],
})
export class InitModule implements OnModuleInit {
  constructor(private readonly initService: InitService) {}
  async onModuleInit() {
    try {
      await this.initService.initApp();
    } catch (error) {
      new InternalServerErrorException(error, '롤 초기화 에러');
    }
  }
}
