import { Injectable } from '@nestjs/common';
import type { Prisma, QueryRoleAssociationDto } from '@shared/schema';
import type { CreateRoleAssociationDto } from '@shared/schema';
import type { RoleAssociationsRepository } from '../repository/role-associations.repository';

@Injectable()
export class RoleAssociationsService {
  constructor(private readonly repository: RoleAssociationsRepository) {}

  getUnique(args: Prisma.RoleAssociationFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.RoleAssociationFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.RoleAssociationUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createRoleAssociationDto: CreateRoleAssociationDto) {
    return this.repository.create({
      data: createRoleAssociationDto,
    });
  }

  async getManyByQuery(query: QueryRoleAssociationDto) {
    const include = {
      group: true,
    };
    const args = query.toArgs({ include });
    const countArgs = query.toCountArgs<Prisma.RoleAssociationCountArgs>();
    const roleAssociations = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      roleAssociations,
      count,
    };
  }

  update(args: Prisma.RoleAssociationUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
