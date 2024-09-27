import { Injectable, Logger } from '@nestjs/common';
import {
  RolesService,
  SpacesService,
  SubjectsService,
  TenanciesService,
  TenantsService,
  UsersService,
} from '../../entities';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../configs';
import { PasswordService } from '../password/password.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InitService {
  logger = new Logger(InitService.name);
  LOG_PREFIX = `${InitService.name}`;
  constructor(
    private readonly rolesService: RolesService,
    private readonly spacesService: SpacesService,
    private readonly configService: ConfigService,
    private readonly tenanciesService: TenanciesService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly subjectsService: SubjectsService,
  ) {}

  async createDefaultRoles() {
    let adminRoleId = null;
    this.logger.log(`[${this.LOG_PREFIX}] 앱시작 ROLE 생성`);

    const superAdminRole = await this.rolesService.getUnique({
      where: { name: 'SUPER_ADMIN' },
    });

    if (!superAdminRole) {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민 생성`);
      const role = await this.rolesService.create({ name: 'SUPER_ADMIN' });

      adminRoleId = role.id;
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민이 이미 존재합니다.`);

      adminRoleId = superAdminRole.id;
    }

    this.logger.log(`[${this.LOG_PREFIX}] USER ROLE 생성`);

    const userRole = await this.rolesService.getUnique({ where: { name: 'USER' } });

    if (!userRole) {
      this.logger.log(`[${this.LOG_PREFIX}] USER 생성`);

      await this.rolesService.create({ name: 'USER' });
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] USER가 이미 존재합니다.`);
    }

    return {
      adminRoleId,
    };
  }

  async createDefaultSpace() {
    this.logger.log(`[${this.LOG_PREFIX}] 기본 공간 생성`);
    let spaceId = null;
    let tenancyId = null;

    const appConfig = this.configService.get<AppConfig>('app');

    const appName = appConfig.name;

    const defaultSpace = await this.spacesService.getUnique({
      where: { name: appName },
    });

    if (defaultSpace) {
      spaceId = defaultSpace.id;

      this.logger.log(`[${this.LOG_PREFIX}] 기본 공간이 이미 존재합니다.`);
    } else {
      const space = await this.spacesService.create({ data: { name: appName } });

      spaceId = space.id;

      this.logger.log(`[${this.LOG_PREFIX}] 기본 공간 생성`);
    }

    const defaultTenancy = await this.tenanciesService.getUnique({
      where: { spaceId },
    });

    if (defaultTenancy) {
      this.logger.log(`[${this.LOG_PREFIX}] 기본 테넌시가 이미 존재합니다.`);
      tenancyId = defaultTenancy.id;
    } else {
      const tenancy = await this.tenanciesService.create({ data: { spaceId } });
      tenancyId = tenancy.id;
      this.logger.log(`[${this.LOG_PREFIX}] 기본 테넌시 생성`);
    }

    return {
      tenancyId,
      spaceId,
    };
  }

  async createDefaultUser(roleId, tenancyId) {
    const appConfig = this.configService.get<AppConfig>('app');
    const hashedPassword = await this.passwordService.hashPassword('rkdmf12!@');

    const adminUser = this.usersService.getUnique({
      where: {
        email: appConfig.adminEmail,
      },
    });

    if (adminUser) {
      this.logger.log(`[${this.LOG_PREFIX}] 관리자가 이미 존재합니다.`);
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] 관리자 생성`);
      await this.usersService.create({
        data: {
          email: appConfig.adminEmail,
          password: hashedPassword,
          name: appConfig.name,
          phone: '01073162347',
          tenants: {
            create: {
              tenancyId,
              roleId,
              active: true,
            },
          },
          profiles: {
            create: {
              nickname: appConfig.name,
            },
          },
        },
      });
    }
  }

  createSubjects() {
    return Promise.all(
      Object.keys(Prisma.ModelName).map((key) =>
        this.subjectsService.create({ data: { name: key } }),
      ),
    );
  }

  async initApp() {
    await this.createSubjects();
    const { adminRoleId } = await this.createDefaultRoles();
    const { tenancyId } = await this.createDefaultSpace();

    await this.createDefaultUser(adminRoleId, tenancyId);
  }
}
