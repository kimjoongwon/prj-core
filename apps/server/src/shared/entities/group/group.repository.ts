import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { GroupPageOptionsDto } from './dtos/group-page-options.dto';

@Injectable()
export class GroupRepository {
  constructor(private prisma: PrismaService) {}

  async findGroupsByPageOptions(pageOptions: GroupPageOptionsDto) {
    const { take, name, skip, orderByCreatedAt } = pageOptions;
    const groups = await this.prisma.group.findMany({
      where: {
        name,
        deletedAt: null,
      },
      orderBy: {
        createdAt: orderByCreatedAt,
      },
      skip,
      take,
      include: {
        service: true,
        space: true,
      },
    });

    return groups;
  }

  async count(pageOptions: GroupPageOptionsDto) {
    const { take, name, skip } = pageOptions;
    return this.prisma.group.count({
      where: {
        name,
      },
      take,
      skip,
    });
  }

  async findOne() {
    return null;
  }

  async create(data: Prisma.GroupCreateArgs) {
    return this.prisma.group.create(data);
  }

  async update() {
    return null;
  }

  async remove() {
    return null;
  }
}
