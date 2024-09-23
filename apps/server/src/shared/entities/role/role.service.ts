import { Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { IService } from '../../types';
import { RoleRepository } from './role.repository';
import { CreateRoleDto, RoleQueryDto, UpdateRoleDto } from './dto';
import { PaginationMananger } from '../../utils';

@Injectable()
export class RoleService implements IService {
  constructor(private readonly repository: RoleRepository) {}

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

  async getManyByQuery(query: RoleQueryDto) {
    const args = PaginationMananger.toArgs(query);
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

  createSuperAdmin() {
    return this.repository.create({ data: { name: 'SUPER_ADMIN' } });
  }

  createUser() {
    return this.repository.create({ data: { name: 'USER' } });
  }

  findSuperAdminRole() {
    return this.repository.findFirst({
      where: {
        name: Roles.SUPER_ADMIN,
      },
    });
  }

  async findUserRole() {
    return this.repository.findFirst({
      where: {
        name: Roles.USER,
      },
    });
  }
  async getSuperAdminRole() {
    return this.repository.findUnique({
      where: {
        name: Roles.SUPER_ADMIN,
      },
    });
  }

  async getUserRole() {
    return this.repository.findUnique({
      where: {
        name: Roles.USER,
      },
    });
  }
}
