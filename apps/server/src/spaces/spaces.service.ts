import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SpacesService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}
  async onModuleInit() {
    const baseSpace = await this.prisma.space.findUnique({
      where: {
        name: '기본',
      },
    });

    console.log('baseSpace', baseSpace);

    if (!baseSpace) {
      await this.prisma.space.create({
        data: {
          name: '기본',
          address: '기본',
          phone: '기본',
        },
      });
    }
  }

  create() {
    return 'This action adds a new space';
  }

  async findBaseSpace() {
    return this.prisma.space.findUnique({
      where: {
        name: '기본',
      },
    });
  }
}
