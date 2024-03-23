import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name);
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const superAdminRole = await this.prisma.role.findFirst({
      where: {
        name: 'SUPER_ADMIN',
      },
    });

    const userRole = await this.prisma.role.findFirst({
      where: {
        name: 'USER',
      },
    });

    if (!superAdminRole) {
      this.logger.log('Create SUPER_ADMIN Role');
      await this.createSuperAdmin();
    }

    if (!userRole) {
      this.logger.log('Create USER Role');
      await this.createUser();
    }
  }

  async createSuperAdmin() {
    return this.prisma.role.create({ data: { name: 'SUPER_ADMIN' } });
  }

  async createUser() {
    return this.prisma.role.create({ data: { name: 'USER' } });
  }

  async findUserRole() {
    return this.prisma.role.findFirst({
      where: {
        name: Roles.USER,
      },
    });
  }
}
