import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateGroupDto } from '../../dtos/groups/create-group.dto';
import { UpdateGroupDto } from '../../dtos/groups/update-group.dto';

import { GroupPageOptionsDto } from '../../dtos/groups/group-page-options.dto';
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

  async findGroupsByPageOptions(pageOptions: GroupPageOptionsDto) {
    const groups =
      await this.groupsRepository.findGroupsByPageOptions(pageOptions);

    const count = await this.groupsRepository.count(pageOptions);

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
