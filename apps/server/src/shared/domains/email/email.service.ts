import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SMTPConfig } from '../../configs';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  sendResetPassword() {
    this.mailerService.sendMail({
      to: 'wallydevplan@gmail.com',
      from: this.configService.get<SMTPConfig>('smtp').sender,
      subject: 'Reset Password',
      html: '<h1>Reset Password</h1>',
    });
  }
}
