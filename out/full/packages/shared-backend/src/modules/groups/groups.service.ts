import { Injectable } from '@nestjs/common';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createGroupDto: CreateGroupDto) {
    return this.prisma.group.create({
      data: createGroupDto,
    });
  }

  findAll() {
    return this.prisma.group.findMany({
      where: {
        deletedAt: null,
      },
    });
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
