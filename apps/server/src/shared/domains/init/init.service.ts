import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../configs';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from '../password/password.service';

@Injectable()
export class InitService {
  logger = new Logger(InitService.name);
  LOG_PREFIX = `${InitService.name}`;
  constructor(
    private readonly passwordService: PasswordService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createDefaultRoles(tenancyId: string) {
    let adminRoleId = null;
    this.logger.log(`[${this.LOG_PREFIX}] 앱시작 ROLE 생성`);

    const superAdminRole = await this.prisma.role.findUnique({
      where: { name: 'SUPER_ADMIN' },
    });

    if (!superAdminRole) {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민 생성`);
      const role = await this.prisma.role.create({
        data: {
          name: 'SUPER_ADMIN',
          tenancyId,
        },
      });

      adminRoleId = role.id;
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] 슈퍼어드민이 이미 존재합니다.`);

      adminRoleId = superAdminRole.id;
    }

    this.logger.log(`[${this.LOG_PREFIX}] USER ROLE 생성`);

    const userRole = await this.prisma.role.findUnique({ where: { name: 'USER' } });

    if (!userRole) {
      this.logger.log(`[${this.LOG_PREFIX}] USER 생성`);

      await this.prisma.role.create({
        data: {
          name: 'USER',
          tenancyId,
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

    const defaultSpace = await this.prisma.space.findUnique({
      where: { name: appName },
    });

    if (defaultSpace) {
      spaceId = defaultSpace.id;

      this.logger.log(`[${this.LOG_PREFIX}] 기본 공간이 이미 존재합니다.`);
    } else {
      const space = await this.prisma.space.create({
        data: {
          name: appName,
        },
      });

      spaceId = space.id;

      this.logger.log(`[${this.LOG_PREFIX}] 기본 공간 생성`);
    }

    return {
      spaceId,
    };
  }

  async createDefaultUser(roleId, spaceId, tenancyId) {
    const appConfig = this.configService.get<AppConfig>('app');
    const hashedPassword = await this.passwordService.hashPassword('rkdmf12!@');

    const adminUser = await this.prisma.user.findUnique({
      where: {
        email: appConfig.adminEmail,
      },
    });

    let userId = adminUser?.id;

    if (adminUser) {
      this.logger.log(`[${this.LOG_PREFIX}] 관리자가 이미 존재합니다.`);
      return userId;
    } else {
      this.logger.log(`[${this.LOG_PREFIX}] 관리자 생성`);
      const user = await this.prisma.user.create({
        data: {
          email: appConfig.adminEmail,
          password: hashedPassword,
          name: appConfig.name,
          phone: '01073162347',
          tenancyId,
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

      const userService = await this.prisma.service.findUnique({
        where: {
          name: 'USER',
        },
      });

      const category = await this.prisma.category.create({
        data: {
          name: '공통',
          type: 'ROOT',
          tenancyId,
          serviceId: userService.id,
        },
      });

      const group = await this.prisma.group.create({
        data: {
          name: '공통',
          tenancyId,
          serviceId: userService.id,
        },
      });

      await this.prisma.association.create({
        data: {
          groupId: group.id,
          serviceId: userService.id,
          userId: user.id,
          tenancyId,
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
              serviceId: userService.id,
              tenancyId,
            },
          },
        },
      });

      userId = user.id;
    }
  }

  async createSubjects(tenancyId: string) {
    return await Promise.all(
      Object.keys(Prisma.ModelName).map(async (key) => {
        const subject = await this.prisma.subject.findUnique({ where: { name: key } });
        if (!subject) {
          return this.prisma.subject.create({ data: { name: key, tenancyId } });
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
      ].map(async (seedService: { name: $Enums.ServiceNames; label: string }) => {
        const service = await this.prisma.service.findUnique({ where: { name: seedService.name } });
        if (!service) {
          return this.prisma.service.create({ data: seedService });
        } else {
          return null;
        }
      }),
    );
  }

  initPage() {
    this.logger.log(`[${this.LOG_PREFIX}] 페이지 생성`);
  }

  async createDefaultTenancy(spaceId: string) {
    this.logger.log(`[${this.LOG_PREFIX}] 기본 Tenancy 생성`);
    const tenancy = await this.prisma.tenancy.findUnique({
      where: { spaceId },
    });

    if (!tenancy) {
      this.logger.log(`[${this.LOG_PREFIX}] 기본 Tenancy 생성`);
      return this.prisma.tenancy.create({
        data: {
          spaceId,
        },
      });
    }

    return tenancy;
  }

  async initApp() {
    await this.createServices();
    const { spaceId } = await this.createDefaultSpace();
    const { id: tenancyId } = await this.createDefaultTenancy(spaceId);
    await this.createSubjects(tenancyId);
    const { adminRoleId } = await this.createDefaultRoles(tenancyId);
    await this.createDefaultUser(adminRoleId, spaceId, tenancyId);
  }
}
