import { Injectable } from '@nestjs/common';
import { TemplateDto, TemplatesService } from '../../entities';
import Mustache from 'mustache';

@Injectable()
export class TemplateService {
  constructor(private readonly templatesService: TemplatesService) {}

  getEmailVerification() {
    return this.templatesService.getUnique({
      where: {
        name: 'EMAIL_VERIFICATION',
      },
      include: {
        post: true,
      },
    });
  }

  getWelcome() {
    return this.templatesService.getUnique({
      where: {
        name: 'WELCOME',
      },
      include: {
        post: true,
      },
    });
  }

  getResetPassword() {
    return this.templatesService.getUnique({
      where: {
        name: 'RESET_PASSWORD',
      },
      include: {
        post: true,
      },
    });
  }

  convertToHtml(emailTemplate: TemplateDto, data: any): string {
    return Mustache.render(emailTemplate.post.content, data);
  }
}
