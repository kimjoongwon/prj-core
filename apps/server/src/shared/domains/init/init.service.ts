import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../configs';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from '../password/password.service';
import { fileCategroySeed } from './seeds/depot-category.seed';
import { spaceGroupSeed } from './seeds/space-group.seed';

@Injectable()
export class InitService {
  logger = new Logger(InitService.name);
  LOG_PREFIX = `${InitService.name}`;
  constructor(
    private readonly passwordService: PasswordService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createDefaultRoles(tenantId: string) {
    let adminRoleId = null;
    this.logger.log(`[${this.LOG_PREFIX}] 앱시작 ROLE 생성`);

    const superAdminRole = await this.prisma.role.findFirst({
      where: { name: 'SUPER_ADMIN' },
    });

    if (!superAdminRole) {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민 생성`);
      const role = await this.prisma.role.create({
        data: {
          name: 'SUPER_ADMIN',
          tenantId,
        },
      });

      adminRoleId = role.id;
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민이 이미 존재합니다.`);

      adminRoleId = superAdminRole.id;
    }

    this.logger.log(`[${this.LOG_PREFIX}] USER ROLE 생성`);

    const userRole = await this.prisma.role.findFirst({ where: { name: 'USER' } });

    if (!userRole) {
      this.logger.log(`[${this.LOG_PREFIX}] USER 생성`);

      await this.prisma.role.create({
        data: {
          name: 'USER',
          tenantId,
        },
      });
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] USER가 이미 존재합니다.`);
    }

    return {
      adminRoleId,
    };
  }

  async createDefaultGym() {
    this.logger.log(`[${this.LOG_PREFIX}] 기본 공간 생성`);
    let gym = null;

    const appConfig = this.configService.get<AppConfig>('app');

    const appName = appConfig.name;

    const defaultGym = await this.prisma.gym.findFirst({
      where: { space: { name: appName } },
      include: {
        space: true,
      },
    });

    if (defaultGym) {
      gym = defaultGym;

      this.logger.log(`[${this.LOG_PREFIX}] 기본 GYM이 이미 존재합니다.`);
    } else {
      const _gym = await this.prisma.gym.create({
        data: {
          address: '서울시 강남구',
          phone: '01073162347',
          businessNumber: '1234567890',
          email: 'galaxy@gmail.com',
          space: {
            create: {
              name: appName,
              label: appName,
            },
          },
        },
        include: {
          space: true,
        },
      });

      gym = _gym;

      this.logger.log(`[${this.LOG_PREFIX}] 기본 GYM 생성`);
    }

    return {
      spaceId: gym.spaceId,
    };
  }

  async createDefaultUser() {
    const appConfig = this.configService.get<AppConfig>('app');
    const hashedPassword = await this.passwordService.hashPassword('rkdmf12!@');

    const adminUser = await this.prisma.user.findUnique({
      where: {
        name: appConfig.adminEmail,
      },
      include: {
        tenants: true,
      },
    });

    let user = adminUser;

    if (adminUser) {
      this.logger.log(`[${this.LOG_PREFIX}] 관리자가 이미 존재합니다.`);
      return adminUser;
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] 관리자 생성`);
      user = await this.prisma.user.create({
        data: {
          name: appConfig.adminEmail,
          password: hashedPassword,
          phone: '01073162347',
          profiles: {
            create: {
              name: appConfig.name,
              nickname: appConfig.name,
            },
          },
        },
        include: {
          tenants: true,
        },
      });

      return user;
    }
  }

  async createUserCommonGroupAndCategory(tenantId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        name: this.configService.get<AppConfig>('app').adminEmail,
      },
      include: {
        tenants: {
          include: {
            space: true,
          },
        },
      },
    });

    const userService = await this.prisma.service.findUnique({
      where: {
        name: 'USER',
      },
    });

    const category = await this.prisma.category.create({
      data: {
        name: '공통',
        type: 'ROOT',
        tenantId,
        serviceId: userService.id,
      },
    });

    const group = await this.prisma.group.create({
      data: {
        label: '공통',
        name: '공통',
        tenantId,
        serviceId: userService.id,
      },
    });

    await this.prisma.association.create({
      data: {
        groupId: group.id,
        userId: user.id,
      },
    });

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        classification: {
          create: {
            categoryId: category.id,
          },
        },
      },
    });
  }

  async createSubjects(tenantId: string) {
    return await Promise.all(
      Object.keys(Prisma.ModelName).map(async (key) => {
        const subject = await this.prisma.subject.findUnique({ where: { name: key } });
        if (!subject) {
          return this.prisma.subject.create({ data: { name: key, tenantId } });
        } else {
          return null;
        }
      }),
    );
  }

  async createServices() {
    return await Promise.all(
      [
        { name: $Enums.ServiceNames.USER, label: '이용자' },
        { name: $Enums.ServiceNames.SPACE, label: '공간' },
        { name: $Enums.ServiceNames.ROLE, label: '역할' },
        { name: $Enums.ServiceNames.TIMELINE, label: '타임라인' },
        { name: $Enums.ServiceNames.CONTENT, label: '컨탠츠' },
        { name: $Enums.ServiceNames.FILE, label: '파일' },
      ].map(async (seedService: { name: $Enums.ServiceNames; label: string }) => {
        const service = await this.prisma.service.findUnique({ where: { name: seedService.name } });
        if (!service) {
          return this.prisma.service.create({ data: seedService });
        } else {
          return service;
        }
      }),
    );
  }

  initPage() {
    this.logger.log(`[${this.LOG_PREFIX}] 페이지 생성`);
  }

  async createGroup(tenantId: string) {
    this.logger.log(`[${this.LOG_PREFIX}] 공간그룹 생성`);

    const services = await this.prisma.service.findMany();
    const spaceServiceId = services.find(
      (service) => service.name === $Enums.ServiceNames.SPACE,
    ).id;

    spaceGroupSeed.forEach(async (group) => {
      const existGroup = await this.prisma.group.findFirst({
        where: { name: group.name },
      });

      if (!existGroup) {
        await this.prisma.group.create({
          data: { ...group, tenantId, serviceId: spaceServiceId },
        });
      }
    });
  }

  async createCategory(tenantId: string) {
    this.logger.log(`[${this.LOG_PREFIX}] 카테고리 생성`);

    const services = await this.prisma.service.findMany();
    const fileServiceId = services.find((service) => service.name === $Enums.ServiceNames.FILE).id;

    fileCategroySeed.forEach(async (category) => {
      const existCategory = await this.prisma.category.findUnique({
        where: { name: category.name },
      });

      if (!existCategory) {
        await this.prisma.category.create({
          data: { ...category, tenantId, serviceId: fileServiceId },
        });
      }
    });
  }

  createDefaultTenant(spaceId: string, userId: string) {
    return this.prisma.tenant.create({
      data: {
        spaceId,
        userId,
        main: true,
      },
    });
  }

  async initApp() {
    await this.createServices();
    const { spaceId } = await this.createDefaultGym();
    const user = await this.createDefaultUser();
    const tenant = await this.createDefaultTenant(spaceId, user.id);
    const tenantId = tenant.id;
    await this.createDefaultRoles(tenantId);
    await this.createSubjects(tenantId);
    await this.createCategory(tenantId);
    await this.createGroup(tenantId);
  }
}
