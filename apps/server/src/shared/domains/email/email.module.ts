import { Module } from '@nestjs/common';
import { EmailService } from './Email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
