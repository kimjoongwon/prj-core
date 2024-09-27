import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IService } from '../../types';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto, RoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RolesService {
  constructor(private readonly repository: RolesRepository) {}

  getUnique(args: Prisma.RoleFindUniqueArgs): Promise<RoleDto> {
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

  create(createRoleDto: CreateRoleDto) {
    return this.repository.create({ data: createRoleDto });
  }

  async getManyByQuery(args: Prisma.RoleFindManyArgs) {
    const roles = await this.repository.findMany(args);
    const count = await this.repository.count(args as Prisma.RoleCountArgs);
    return {
      roles,
      count,
    };
  }

  update(args: Prisma.RoleUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
