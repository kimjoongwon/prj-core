import { Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IService } from '../../types';
import { RoleRepository } from './role.repository';
import { PaginationMananger } from '../../utils';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleQueryDto } from './dto/role-query.dto';

@Injectable()
export class RoleService implements IService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: RoleRepository,
  ) {}

  getUnique(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  getFirst(id: string) {
    return this.repository.findFirst({ where: { id } });
  }

  removeMany(ids: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        removedAt: new Date(),
      },
    });
  }

  delete(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createRoleDto: CreateRoleDto) {
    return this.repository.create({ data: createRoleDto });
  }

  async getManyByQuery(pageQuery: RoleQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
    const roles = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      roles,
      count,
    };
  }

  update(roleId: string, updateRoleDto: UpdateRoleDto) {
    return this.repository.update({
      where: {
        id: roleId,
      },
      data: updateRoleDto,
    });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }

  getAllRole() {
    return this.prisma.role.findMany({});
  }

  async createSuperAdmin() {
    return this.prisma.role.create({ data: { name: 'SUPER_ADMIN' } });
  }

  async createUserRole() {
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
