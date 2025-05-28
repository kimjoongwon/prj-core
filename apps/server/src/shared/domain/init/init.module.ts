import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from '../password/password.service';

@Module({
  providers: [InitService, ConfigService, PasswordService],
  exports: [InitService],
})
export class InitModule {}
