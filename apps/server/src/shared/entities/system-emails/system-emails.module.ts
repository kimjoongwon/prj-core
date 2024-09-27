import { Module } from '@nestjs/common';
import { SystemEmailsService } from './system-emails.service';
import { SystemEmailsRepository } from './system-emails.repository';
import { SystemEmailsController } from './system-emails.controller';

@Module({
  // controllers: [SystemEmailsController],
  providers: [SystemEmailsService, SystemEmailsRepository],
  exports: [SystemEmailsService],
})
export class SystemEmailsModule {}
