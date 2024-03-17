import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
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
      await this.create({ name: 'SUPER_ADMIN' });
    }

    if (!userRole) {
      this.logger.log('Create USER Role');
      await this.create({ name: 'USER' });
    }
  }

  async create(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({ data: createRoleDto });
  }

  findAll() {
    return `This action returns all roles`;
  }

  async findUserRole() {
    return this.prisma.role.findFirst({
      where: {
        name: Roles.USER,
      },
    });
  }
}
