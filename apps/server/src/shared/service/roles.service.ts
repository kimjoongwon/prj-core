import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RolesRepository } from '../repository/role.repository';
import { CreateRoleDto, UpdateRoleDto } from '../dto';

@Injectable()
export class RolesService {
  constructor(private readonly repository: RolesRepository) {}

  getUnique(args: Prisma.RoleFindUniqueArgs) {
    return this.repository.findUnique(args);
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

  createRoleDto(createRoleDto: CreateRoleDto) {
    return this.repository.create({
      data: {
        name: createRoleDto.name,
        tenantId: createRoleDto.tenantId,
      },
    });
  }

  async getManyByQuery(args: Prisma.RoleFindManyArgs) {
    const roles = await this.repository.findMany(args);
    const count = await this.repository.count(args as Prisma.RoleCountArgs);
    return {
      roles,
      count,
    };
  }

  update(roleId, updateRoleDto: UpdateRoleDto) {
    return this.repository.update({
      where: { id: roleId },
      data: updateRoleDto,
    });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
