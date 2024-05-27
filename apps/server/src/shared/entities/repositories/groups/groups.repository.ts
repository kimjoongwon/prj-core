import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { GroupPageOptionsDto } from '../../dtos/page-options/group-page-options.dto';

@Injectable()
export class GroupsRepository {
  constructor(private prisma: PrismaService) {}

  async findByPageOptions({
    take,
    skip,
    name,
    orderByCreatedAt,
  }: GroupPageOptionsDto) {
    return this.prisma.group.findMany({
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
  }

  async count(args: Prisma.GroupCountArgs) {
    return this.prisma.group.count(args);
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
