import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { queryBuilder } from '@common';
import { PaginatedGroup, GroupForm } from './models';
import { CreateGroupInput, GetGroupsArgs, UpdateGroupInput } from './dto';
import { PrismaService } from '@modules/global/prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createGroupInput: CreateGroupInput) {
    return this.prisma.group.create({
      data: {
        ...createGroupInput,
        serviceId: '',
        itemId: '',
        tenantId: '',
        name: {
          ko: '',
          en: '',
        },
      },
    });
  }

  async findForm(id: string): Promise<GroupForm> {
    if (id === 'new') {
      return {
        name: { en: '', ko: '' },
        serviceId: '',
        id: '',
      };
    }

    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    return {
      ...group,
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
