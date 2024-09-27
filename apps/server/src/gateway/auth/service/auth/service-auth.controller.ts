import { Controller, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceAuthService } from './service-auth.service';
import { ApiResponseEntity, ContextProvider, EmailService, RoleDto, SystemEmailDto } from '@shared';

@ApiTags('SERVICE_AUTH')
@Controller()
export class ServiceAuthController {
  constructor(
    private readonly serviceAuthService: ServiceAuthService,
    private readonly emailService: EmailService,
  ) {}

  @Get('roles')
  @ApiResponseEntity(RoleDto, HttpStatus.OK, { isArray: true })
  async getServiceAuthRoles() {
    return this.serviceAuthService.getServiceAuthRoles();
  }

  @Post('system-emails/templates/email-verification')
  @ApiResponseEntity(SystemEmailDto, HttpStatus.OK)
  async sendEmailVerification() {
    return this.emailService.sendEmailVerification();
  }

  @Patch('system-emails/:systemEmailId/status/completed')
  @ApiResponseEntity(SystemEmailDto, HttpStatus.OK)
  async verifyEmail(@Param('systemEmailId') systemEmailId: string) {
    return this.serviceAuthService.verifyEmail(systemEmailId);
  }

  @Get('system-emails/status/completed')
  @ApiResponseEntity(Boolean, HttpStatus.OK)
  async checkEmailVerification() {
    const user = ContextProvider.getAuthUser();
    return this.emailService.checkEmailVerification(user.id);
  }
}
