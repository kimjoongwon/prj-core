import { Injectable } from '@nestjs/common';
import { RolesService, SystemEmailsService } from '@shared';

@Injectable()
export class ServiceAuthService {
  constructor(
    private readonly rolesService: RolesService,
    private readonly systemEmailsService: SystemEmailsService,
  ) {}

  getServiceAuthRoles() {
    return this.rolesService.getManyByQuery({
      where: {
        name: {
          not: 'SUPER_ADMIN',
        },
      },
    });
  }

  verifyEmail(systemEmailId: string) {
    return this.systemEmailsService.update({
      where: { id: systemEmailId },
      data: {
        status: 'COMPLETED',
      },
    });
  }
}
