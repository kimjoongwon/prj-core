import { Injectable, Logger } from '@nestjs/common';
import {
  CategoriesService,
  RolesService,
  SpacesService,
  SubjectsService,
  TenantsService,
  UsersService,
} from '../../entities';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../configs';
import { PasswordService } from '../password/password.service';
import { Prisma } from '@prisma/client';
import { ServicesService } from '../../entities/services/services.service';

@Injectable()
export class InitService {
  logger = new Logger(InitService.name);
  LOG_PREFIX = `${InitService.name}`;
  constructor(
    private readonly rolesService: RolesService,
    private readonly spacesService: SpacesService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly subjectsService: SubjectsService,
    private readonly servicesService: ServicesService,
    private readonly categoriesService: CategoriesService,
    private readonly tenantsService: TenantsService,
  ) {}

  async createDefaultRoles() {
    let adminRoleId = null;
    this.logger.log(`[${this.LOG_PREFIX}] 앱시작 ROLE 생성`);

    const superAdminRole = await this.rolesService.getUnique({
      where: { name: 'SUPER_ADMIN' },
    });

    if (!superAdminRole) {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민 생성`);
      const role = await this.rolesService.create({
        data: {
          name: 'SUPER_ADMIN',
          assignmentIds: [],
        },
      });

      adminRoleId = role.id;
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민이 이미 존재합니다.`);

      adminRoleId = superAdminRole.id;
    }

    this.logger.log(`[${this.LOG_PREFIX}] USER ROLE 생성`);

    const userRole = await this.rolesService.getUnique({ where: { name: 'USER' } });

    if (!userRole) {
      this.logger.log(`[${this.LOG_PREFIX}] USER 생성`);

      await this.rolesService.create({
        data: {
          name: 'USER',
          assignmentIds: [],
        },
      });
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

    return {
      spaceId,
    };
  }

  async createDefaultUser(roleId, spaceId) {
    const appConfig = this.configService.get<AppConfig>('app');
    const hashedPassword = await this.passwordService.hashPassword('rkdmf12!@');

    const adminUser = await this.usersService.getUnique({
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
          spaceId,
          assignmentIds: [],
          tenants: {
            create: {
              spaceId,
              roleId,
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

  async createSubjects() {
    return await Promise.all(
      Object.keys(Prisma.ModelName).map(async (key) => {
        const subject = await this.subjectsService.getUnique({ where: { name: key } });
        if (!subject) {
          return this.subjectsService.create({ data: { name: key } });
        } else {
          return null;
        }
      }),
    );
  }

  async createServices() {
    return await Promise.all(
      Object.keys(Prisma.ModelName).map(async (key) => {
        const service = await this.servicesService.getUnique({ where: { name: key } });
        if (!service) {
          return this.servicesService.create({ data: { name: key } });
        } else {
          return null;
        }
      }),
    );
  }

  initPage() {
    this.logger.log(`[${this.LOG_PREFIX}] 페이지 생성`);
  }

  async createUserCategories() {
    const userService = await this.servicesService.getUnique({
      where: {
        name: 'User',
      },
    });

    const tenant = await this.tenantsService.getUnique({
      where: {
        seq: 1,
      },
    });

    const category = await this.categoriesService.getFirst({
      where: {
        name: '이용자',
      },
    });

    if (!category) {
      await this.categoriesService.create({
        data: {
          tenantId: tenant?.id,
          serviceId: userService.id,
          name: '이용자',
          parentId: null,
          type: 'ROOT',
          children: {
            createMany: {
              data: [
                {
                  name: '회원',
                  serviceId: userService.id,
                  type: 'LEAF',
                  tenantId: tenant.id,
                },
                {
                  tenantId: tenant.id,
                  serviceId: userService.id,
                  type: 'LEAF',
                  name: '비회원',
                },
              ],
            },
          },
        },
      });
    }
  }

  async initApp() {
    await this.createSubjects();
    await this.createServices();
    const { adminRoleId } = await this.createDefaultRoles();
    const { spaceId } = await this.createDefaultSpace();
    await this.createDefaultUser(adminRoleId, spaceId);
    await this.createUserCategories();
  }
}
