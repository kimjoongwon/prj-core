import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { GroupDto } from './dtos';
import { Group } from './group.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GroupsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByQuery(args: Prisma.GroupFindManyArgs): Promise<Group[]> {
    const groups = await this.prisma.group.findMany(args);
    return groups.map((group) => plainToInstance(Group, group));
  }

  async count(args: Prisma.GroupCountArgs) {
    return this.prisma.group.count(args);
  }

  async findUnique(args: Prisma.GroupFindUniqueArgs) {
    return this.prisma.group.findUnique(args);
  }

  async findOne(args: Prisma.GroupFindFirstArgs) {
    return this.prisma.group.findFirst(args);
  }

  async create(args: Prisma.GroupCreateArgs) {
    return this.prisma.group.create(args);
  }

  async update(args: Prisma.GroupUpdateArgs) {
    return this.prisma.group.update(args);
  }

  async updateMany(args: Prisma.GroupUpdateManyArgs) {
    return this.prisma.group.updateMany(args);
  }

  async delete(args: Prisma.GroupDeleteArgs) {
    return this.prisma.group.delete(args);
  }
}
