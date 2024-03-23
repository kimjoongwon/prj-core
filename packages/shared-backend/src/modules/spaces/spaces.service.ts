import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SpacesService implements OnModuleInit {
  private readonly logger = new Logger(SpacesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const baseSpace = await this.prisma.space.findUnique({
      where: {
        name: '기본',
      },
    });

    this.logger.log(baseSpace, 'BaseSpace Exist');

    if (!baseSpace) {
      await this.prisma.space.create({
        data: {
          name: '기본',
        },
      });
    }
  }

  async findBaseSpace() {
    return this.prisma.space.findUnique({
      where: {
        name: '기본',
      },
    });
  }
}
