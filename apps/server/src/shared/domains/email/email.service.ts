import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, SMTPConfig } from '../../configs';
import { TemplateService } from '../template/Template.service';
import { ContextProvider } from '../../providers';
import { TemplateDto } from '../../entities';

@Injectable()
export class EmailService {
  constructor(
    private readonly templateService: TemplateService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  appConfig = this.configService.get<AppConfig>('app');
  user = ContextProvider.getAuthUser();

  async sendResetPassword() {
    const template = (await this.templateService.getResetPassword()) as TemplateDto;
    const resetPasswordHtml = this.templateService.convertToHtml(template, {
      resetPasswordLink: `${this.appConfig.frontendDomain}/reset-password`,
    });

    this.mailerService.sendMail({
      to: this.user.email,
      from: this.configService.get<SMTPConfig>('smtp').sender,
      subject: 'Reset Password',
      html: resetPasswordHtml,
    });
  }

  async sendEmailVerification() {
    const template = (await this.templateService.getEmailVerification()) as TemplateDto;
    const emailVerificationHtml = this.templateService.convertToHtml(template, {
      emailVerificationLink: `${this.appConfig.frontendDomain}/verify-email`,
    });

    this.mailerService.sendMail({
      to: this.user.email,
      from: this.configService.get<SMTPConfig>('smtp').sender,
      subject: 'Reset Password',
      html: emailVerificationHtml,
    });
  }

  async sendWelcome() {
    const template = (await this.templateService.getWelcome()) as TemplateDto;
    const welcomeHtml = this.templateService.convertToHtml(template, {
      welcomeMessage: 'Welcome to our platform!',
    });

    this.mailerService.sendMail({
      to: this.user.email,
      from: this.configService.get<SMTPConfig>('smtp').sender,
      subject: 'Reset Password',
      html: welcomeHtml,
    });
  }
}
