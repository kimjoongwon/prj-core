import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { PaginatedRole, RoleForm } from './models';
import { CreateRoleInput, GetRolesArgs, UpdateRoleInput } from './dto';
import { PrismaService } from '@modules/global/prisma/prisma.service';
import { queryBuilder } from '@common/utils';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRoleInput: CreateRoleInput) {
    return this.prisma.role.create({
      data: createRoleInput,
    });
  }

  findForm(): RoleForm {
    return {
      name: 'USER',
      accessPages: [],
    };
  }

  async findPaginatedRole(args: GetRolesArgs): Promise<PaginatedRole> {
    const query = queryBuilder(args, []);

    const roles = await this.prisma.role.findMany({
      ...query,
    });

    const totalCount = await this.prisma.role.count({
      where: query?.where,
    });

    const endCursor = last(roles)?.id;

    return {
      edges: roles.map(role => ({ node: role })),
      nodes: roles,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(roles.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.role.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateRoleInput) {
    return this.prisma.role.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
