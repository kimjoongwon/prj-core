import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateGroupDto } from '../../dtos/create/create-group.dto';
import { UpdateGroupDto } from '../../dtos/update/update-group.dto';
import { PageOptionsDto } from '../../dtos/common/page-option.dto';
import { GroupPageOptionsDto } from 'src/domains/admin/groups/dtos/group-page-options.dto';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createGroupDto: CreateGroupDto) {
    return this.prisma.group.create({
      data: createGroupDto,
    });
  }

  async findByPageOptions(pageOptions: GroupPageOptionsDto) {
    const groups = await this.prisma.group.findMany({
      where: {
        name: pageOptions.name,
        deletedAt: null,
      },
      orderBy: {
        createdAt: pageOptions.order,
      },
      skip: pageOptions.skip,
      take: pageOptions.limit,
      include: {
        service: true,
        space: true,
      },
    });
    const count = await this.prisma.group.count({});

    return {
      count,
      groups,
    };
  }

  findOneById(groupId: string) {
    return this.prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });
  }

  updateById(groupId: string, updateGroupDto: UpdateGroupDto) {
    return this.prisma.group.update({
      where: {
        id: groupId,
      },
      data: updateGroupDto,
    });
  }

  removeById(groupId: string) {
    return this.prisma.group.delete({
      where: {
        id: groupId,
      },
    });
  }
}
