import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { PrismaService } from 'nestjs-prisma';
import { SpacesController } from './spaces.controller';

@Module({
  controllers: [SpacesController],
  providers: [SpacesService, PrismaService],
  exports: [SpacesService],
})
export class SpacesModule implements OnModuleInit {
  logger: Logger = new Logger(SpacesModule.name);
  LOG_PREFIX = `${SpacesModule.name} DB_INIT`;

  constructor(
    private readonly prisma: PrismaService,
    private readonly spacesService: SpacesService,
  ) {}
  async onModuleInit() {
    this.logger.log(`[${this.LOG_PREFIX}] Create Base Space`);
    const baseSpace = await this.prisma.space.findUnique({
      where: {
        name: '기본',
      },
    });

    if (!baseSpace) {
      await this.prisma.space.create({
        data: {
          name: '기본',
        },
      });
    }
  }
}
