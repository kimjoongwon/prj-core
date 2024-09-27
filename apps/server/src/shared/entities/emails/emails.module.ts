import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsRepository } from './emails.repository';

@Module({
  providers: [EmailsService, EmailsRepository],
  exports: [EmailsService],
})
export class EmailsModule {}
