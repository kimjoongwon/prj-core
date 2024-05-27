import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateGroupDto } from '../../dtos/create/create-group.dto';
import { UpdateGroupDto } from '../../dtos/update/update-group.dto';

import { GroupPageOptionsDto } from '../../dtos/page-options/group-page-options.dto';
import { GroupsRepository } from '../../repositories/groups/groups.repository';

@Injectable()
export class GroupsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupsRepository: GroupsRepository,
  ) {}

  create(createGroupDto: CreateGroupDto) {
    return this.groupsRepository.create({ data: createGroupDto });
  }

  async findByPageOptions(pageOptions: GroupPageOptionsDto) {
    const groups = await this.groupsRepository.findByPageOptions(pageOptions);
    const count = await this.groupsRepository.count({
      where: { deletedAt: null, name: pageOptions.name },
    });

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
