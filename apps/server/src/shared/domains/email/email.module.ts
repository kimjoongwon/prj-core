import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TemplateModule } from '../template/template.module';
import { EmailsModule, RolesModule, SystemEmailsModule, UsersModule } from '../../entities';

@Module({
  imports: [TemplateModule, EmailsModule, SystemEmailsModule, UsersModule, RolesModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
