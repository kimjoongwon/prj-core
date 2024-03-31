import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, RolesService, SpacesService } from '@shared/backend';
import { PasswordService } from 'src/auth/password.service';
import { PrismaService } from 'nestjs-prisma';
import { MenuDto } from './dto';
import { ADMIN_PAGES } from './constants';
@Injectable()
export class AdminService {
  logger = new Logger(AdminService.name);
  constructor(
    private configService: ConfigService,
    private spacesService: SpacesService,
    private rolesService: RolesService,
    private passwordService: PasswordService,
    private prisma: PrismaService,
  ) {}

  getMenus(): MenuDto[] {
    return [
      {
        text: '회원 서비스',
        pathname: ADMIN_PAGES.ADMIN_USER_SERVICE,
        children: [
          {
            text: '회원 카테고리',
            pathname: ADMIN_PAGES.ADMIN_USER_SERVICE_CATEGORY,
          },
        ],
      },
      {
        text: '설정 서비스',
        pathname: ADMIN_PAGES.ADMIN_SETTING_SERVICE,
        children: [
          {
            text: '서비스 관리',
            pathname: ADMIN_PAGES.ADMIN_SETTING_SERVICE_SERVICES,
          },
        ],
      },
    ];
  }

  async createSuperAdmin() {
    const appConfig = this.configService.get<AppConfig>('app');
    let baseSpace = await this.spacesService.findBaseSpace();

    if (!baseSpace) {
      this.logger.log('create promise space');
      baseSpace = await this.spacesService.createBaseSpace();
    }

    let superAdminRole = await this.rolesService.findSuperAdminRole();

    if (!superAdminRole) {
      this.logger.log('create super admin role');
      superAdminRole = await this.rolesService.createSuperAdmin();
    }

    const superAdminUser = await this.prisma.user.findFirst({
      where: {
        tenants: {
          some: {
            roleId: superAdminRole?.id,
          },
        },
      },
    });

    if (superAdminUser) {
      return;
    }

    this.logger.log('create super admin user');
    const hashPassword = await this.passwordService.hashPassword('rkdmf12!@');

    await this.prisma.user.create({
      data: {
        email: `${appConfig?.name}@gmail.com`,
        name: '김중원',
        phone: '01073162347',
        password: hashPassword,
        profiles: {
          create: {
            nickname: '프로미스 관리자',
          },
        },
        tenants: {
          create: {
            roleId: superAdminRole?.id,
            spaceId: baseSpace.id,
          },
        },
      },
    });
  }
}
