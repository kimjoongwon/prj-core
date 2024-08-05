import { Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async createSuperAdmin() {
    return this.prisma.role.create({ data: { name: 'SUPER_ADMIN' } });
  }

  async createUser() {
    return this.prisma.role.create({ data: { name: 'USER' } });
  }

  async findSuperAdminRole() {
    return this.prisma.role.findFirst({
      where: {
        name: Roles.SUPER_ADMIN,
      },
    });
  }

  async findUserRole() {
    return this.prisma.role.findFirst({
      where: {
        name: Roles.USER,
      },
    });
  }
  async getSuperAdminRole() {
    return this.prisma.role.findUnique({
      where: {
        name: Roles.SUPER_ADMIN,
      },
    });
  }

  async getUserRole() {
    return this.prisma.role.findUnique({
      where: {
        name: Roles.USER,
      },
    });
  }
}
