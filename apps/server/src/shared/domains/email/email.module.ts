import { Module } from '@nestjs/common';
import { EmailService } from './Email.service';
import { TemplateModule } from '../template/template.module';

@Module({
  imports: [TemplateModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
