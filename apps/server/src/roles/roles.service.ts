import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Roles } from '@coc/database';

@Injectable()
export class RolesService implements OnModuleInit {
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
      await this.create({ name: 'SUPER_ADMIN' });
    }

    if (!userRole) {
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

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
