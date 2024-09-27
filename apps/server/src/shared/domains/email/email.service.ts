import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, SMTPConfig } from '../../configs';
import { TemplateService } from '../template/Template.service';
import { ContextProvider } from '../../providers';
import { ResponseEntity, RolesService, SystemEmailsService, TemplateDto } from '../../entities';

@Injectable()
export class EmailService {
  constructor(
    private readonly systemEmailsService: SystemEmailsService,
    private readonly mailerService: MailerService,
    private readonly templateService: TemplateService,
    private readonly configService: ConfigService,
    private readonly rolesService: RolesService,
  ) {}

  appConfig = this.configService.get<AppConfig>('app');
  user = ContextProvider.getAuthUser();

  async sendResetPassword() {
    // const template = (await this.templateService.getResetPassword()) as TemplateDto;
    // const resetPasswordHtml = this.templateService.convertToHtml(template, {
    //   resetPasswordLink: `${this.appConfig.frontendDomain}/reset-password`,
    // });
    // this.mailerService.sendMail({
    //   to: this.user.email,
    //   from: this.configService.get<SMTPConfig>('smtp').sender,
    //   subject: 'Reset Password',
    //   html: resetPasswordHtml,
    // });
  }

  async sendEmailVerification() {
    const template = (await this.templateService.getEmailVerification()) as TemplateDto;

    const superAdminRole = await this.rolesService.getUnique({
      where: { name: 'SUPER_ADMIN' },
      include: {
        tenant: {
          include: {
            user: true,
          },
        },
      },
    });

    const systemEmail = await this.systemEmailsService.create({
      data: {
        template: {
          connect: {
            id: template.id,
          },
        },
        status: 'PROGRESS',
        email: {
          create: {
            sentAt: new Date(),
            fromUserId: superAdminRole.tenant.user.id,
            postId: template.postId,
            toUserIds: [this.user.id],
          },
        },
      },
    });

    const emailVerificationHtml = this.templateService.convertToHtml(template, {
      emailVerificationLink: `${this.appConfig.frontendDomain}/service/auth/verify-email/${systemEmail.id}`,
    });

    try {
      this.mailerService.sendMail({
        to: this.user.email,
        from: this.configService.get<SMTPConfig>('smtp').sender,
        subject: template.post.title,
        html: emailVerificationHtml,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        ResponseEntity.WITH_ERROR(
          HttpStatus.INTERNAL_SERVER_ERROR,
          '이메일 발송에 실패하였습니다.',
        ),
      );
    }
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

  async checkEmailVerification(userId: string) {
    const isVerified = this.systemEmailsService.getFirst({
      where: {
        status: 'COMPLETED',
        email: {
          toUserIds: {
            has: userId,
          },
        },
        template: {
          name: 'EMAIL_VERIFICATION',
        },
      },
    });

    return isVerified;
  }
}
