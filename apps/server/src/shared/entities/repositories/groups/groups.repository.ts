import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class GroupsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return [];
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
