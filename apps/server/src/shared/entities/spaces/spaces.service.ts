import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdateGalaxySpace() {
    const name = 'Galaxy';
    return await this.prisma.space.upsert({
      where: { name },
      update: { name },
      create: { name },
    });
  }

  async getAccessibleSpacesByIds(spaceIds: string[]) {
    return this.prisma.space.findMany({ where: { id: { in: spaceIds } } });
  }

  async createBaseSpace() {
    return this.prisma.space.create({
      data: {
        name: '기본',
      },
    });
  }

  async findBaseSpace() {
    return this.prisma.space.findUnique({
      where: {
        name: '기본',
      },
    });
  }

  async getAllSpace() {
    return this.prisma.space.findMany({
      where: {
        deletedAt: null,
      },
    });
  }
}
