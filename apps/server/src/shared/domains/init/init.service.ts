import { Injectable, Logger } from '@nestjs/common';
import {
  RolesService,
  SpacesService,
  TenanciesService,
  TenantsService,
  UsersService,
} from '../../entities';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../configs';

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
    private readonly tenantsService: TenantsService,
  ) {}

  async createDefaultRoles() {
    this.logger.log(`[${this.LOG_PREFIX}] 앱시작 ROLE 생성`);

    const superAdminRole = await this.rolesService.getUnique({
      where: { name: 'SUPER_ADMIN' },
    });

    if (!superAdminRole) {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민 생성`);

      await this.rolesService.create({ name: 'SUPER_ADMIN' });
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민이 이미 존재합니다.`);
    }

    this.logger.log(`[${this.LOG_PREFIX}] USER ROLE 생성`);

    const userRole = await this.rolesService.getUnique({ where: { name: 'USER' } });

    if (!userRole) {
      this.logger.log(`[${this.LOG_PREFIX}] USER 생성`);

      await this.rolesService.create({ name: 'USER' });
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] USER가 이미 존재합니다.`);
    }
  }

  async createDefaultSpace() {
    this.logger.log(`[${this.LOG_PREFIX}] 기본 공간 생성`);
    let spaceId = null;

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
    } else {
      await this.tenanciesService.create({ data: { spaceId } });
      this.logger.log(`[${this.LOG_PREFIX}] 기본 테넌시 생성`);
    }
  }

  async createDefaultUser() {
    const appConfig = this.configService.get<AppConfig>('app');

    const adminUser = this.usersService.getUnique({
      where: {
        email: appConfig.adminEmail,
      },
    });

    if (adminUser) {
      this.logger.log(`[${this.LOG_PREFIX}] 관리자가 이미 존재합니다.`);
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] 관리자 생성`);
      this.tenantsService.create({});
    }
  }

  async initApp() {
    await this.createDefaultRoles();
    await this.createDefaultSpace();
  }
}
