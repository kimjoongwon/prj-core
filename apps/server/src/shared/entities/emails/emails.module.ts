import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsRepository } from './emails.repository';
import { EmailsController } from './emails.controller';

@Module({
  controllers: [EmailsController],
  providers: [EmailsService, EmailsRepository],
  exports: [EmailsService],
})
export class EmailsModule {}
