import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { GroupRepository } from './group.repository';
import { CreateGroupDto } from './dtos/create-group.dto';
import { GroupPageOptionsDto } from './dtos/group-page-options.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupRepository: GroupRepository,
  ) {}
  create(createGroupDto: CreateGroupDto) {
    return this.groupRepository.create({ data: createGroupDto });
  }

  async getGroupsByPageOptions(pageOptions: GroupPageOptionsDto) {
    const groups = await this.groupRepository.findGroupsByPageOptions(pageOptions);

    const count = await this.groupRepository.count(pageOptions);

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
