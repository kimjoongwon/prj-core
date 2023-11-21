import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { PaginatedRole } from './models/paginated-role.model';
import { RoleForm, defaultRoleForm } from './models/role-form.model';
import { CreateRoleInput } from './dto/create-role.input';
import { GetRolesArgs } from './dto/get-roles.args';
import { UpdateRoleInput } from './dto/update-role.input';
import { PrismaService } from '../global/prisma/prisma.service';
import { queryBuilder } from '../../common/utils';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRoleInput: CreateRoleInput) {
    return this.prisma.role.create({
      data: createRoleInput,
    });
  }

  async findForm(roleId: string): Promise<RoleForm> {
    if (roleId === 'new') {
      return defaultRoleForm;
    }
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    return {
      name: role.name,
      options: defaultRoleForm.options,
    };
  }

  async getRoleOptions() {
    const roleOptions = (await this.prisma.role.findMany({})).map(role => ({
      name: role.name,
      value: role.id,
    }));

    return roleOptions;
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

  remove(id: string) {
    return this.prisma.role.delete({
      where: { id },
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
