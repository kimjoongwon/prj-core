import { Module } from '@nestjs/common';

import { CreateSettingsHandler } from './commands/create-settings.command';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const handlers = [CreateSettingsHandler];

@Module({
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, ...handlers],
})
export class UserModule {}
