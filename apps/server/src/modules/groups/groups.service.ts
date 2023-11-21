import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { PrismaService } from '../global/prisma/prisma.service';
import { queryBuilder } from '../../common/utils';
import { CreateGroupInput } from './dto/create-group.input';
import { GetGroupsArgs } from './dto/get-groups.args';
import { UpdateGroupInput } from './dto/update-group.input';
import { GroupForm, defaultGroupForm } from './models/group-form.model';
import { PaginatedGroup } from './models/paginated-group.model';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createGroupInput: CreateGroupInput) {
    return this.prisma.group.create({
      data: createGroupInput,
    });
  }

  async findForm(id: string): Promise<GroupForm> {
    if (id === 'new') {
      return defaultGroupForm;
    }

    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    return {
      name: group.name,
      serviceId: group.serviceId,
      tenantId: group.tenantId,
    };
  }

  async findPaginatedGroup(args: GetGroupsArgs): Promise<PaginatedGroup> {
    const query = queryBuilder(args, []);

    const groups = await this.prisma.group.findMany({
      ...query,
    });

    const totalCount = await this.prisma.group.count({
      where: query?.where,
    });

    const endCursor = last(groups)?.id;

    return {
      edges: groups.map(group => ({ node: group })),
      nodes: groups,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(groups.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.group.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.group.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateGroupInput) {
    return this.prisma.group.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
