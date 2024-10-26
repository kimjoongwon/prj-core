import { Module, OnModuleInit } from '@nestjs/common';
import { InitService } from './init.service';
import {
  PagesModule,
  RolesModule,
  SpacesModule,
  SubjectsModule,
  UsersModule,
} from '../../entities';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from '../password';

@Module({
  imports: [RolesModule, SpacesModule, UsersModule, SubjectsModule, PagesModule],
  providers: [InitService, ConfigService, PasswordService],
  exports: [InitService],
})
export class InitModule implements OnModuleInit {
  constructor(private readonly initService: InitService) {}
  async onModuleInit() {
    await this.initService.initApp();
  }
}
