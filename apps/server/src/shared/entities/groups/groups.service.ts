import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { GroupsRepository } from './groups.repository';
import { CreateGroupDto } from './dtos/create-group.dto';
import { GroupPageOptionsDto } from './dtos/group-page-options.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupsRepository: GroupsRepository,
  ) {}
  create(createGroupDto: CreateGroupDto) {
    return this.groupsRepository.create({ data: createGroupDto });
  }

  async getGroupsByPageOptions(pageOptions: GroupPageOptionsDto) {
    const groups = await this.groupsRepository.findGroupsByPageOptions(pageOptions);

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
