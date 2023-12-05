import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './modules/global/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { RolesService } from './modules/roles/roles.service';
import { SpacesService } from './modules/spaces/spaces.service';
import { CreateUserInput } from './modules/users/dto/create-user.input';
import { AppConfig } from './configs/config.type';
import { PasswordService } from './modules/auth/providers/password.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly rolesService: RolesService,
    private readonly spacesService: SpacesService,
    private readonly passwordService: PasswordService,
    private readonly logger: Logger,
  ) {}

  async setInitialDB() {
    const appConfig = this.configService.get<AppConfig>('app');
    let appSpace = await this.spacesService.findAppSpace();
    if (!appSpace) {
      this.logger.log('create promise space');
      appSpace = await this.spacesService.createPromiseSpace();
    }
    let superAdminRole = await this.rolesService.findSuperAdminRole();

    if (!superAdminRole) {
      this.logger.log('create super admin role');
      superAdminRole = await this.rolesService.createSuperAdminRole();
    }

    const superAdminUser = await this.prisma.user.findFirst({
      where: {
        tenants: {
          some: {
            roleId: superAdminRole.id,
          },
        },
      },
    });

    if (superAdminUser) {
      return;
    }

    this.logger.log('create super admin user');
    const hashPassword = await this.passwordService.hashPassword('rkdmf12!@');
    const user: CreateUserInput = {
      roleId: superAdminRole.id,
      spaceId: appSpace.id,
      phone: appSpace.phone,
      nickname: appConfig.name,
      name: appConfig.name,
      email: appConfig.adminEmail,
      password: hashPassword,
    };

    await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        profiles: {
          create: {
            nickname: user.nickname,
            phone: user.phone,
          },
        },
        tenants: {
          create: {
            roleId: user.roleId,
            spaceId: user.spaceId,
          },
        },
      },
    });
  }
}
