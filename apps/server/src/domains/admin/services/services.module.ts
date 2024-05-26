import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SERVICE_NAME } from '@prisma/client';
import { ServicesService } from '@shared';
import { ServicesController } from './services.controller';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule implements OnModuleInit {
  logger: Logger = new Logger(ServicesModule.name);
  LOG_PREFIX = `${ServicesModule.name} DB_INIT`;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    this.logger.log(`[${this.LOG_PREFIX}] Create Services`);

    const space = await this.prisma.service.findFirst({
      where: {
        name: SERVICE_NAME.SPACE,
      },
    });

    if (!space) {
      this.logger.log('space service is not exist');
      await this.prisma.service.create({
        data: {
          name: SERVICE_NAME.SPACE,
        },
      });
    }

    const user = await this.prisma.service.findFirst({
      where: {
        name: SERVICE_NAME.USER,
      },
    });

    if (!user) {
      this.logger.log('user service is not exist');
      await this.prisma.service.create({
        data: {
          name: SERVICE_NAME.USER,
        },
      });
    }

    const setting = await this.prisma.service.findFirst({
      where: {
        name: 'SETTING',
      },
    });

    if (!setting) {
      this.logger.log('user service is not exist');
      await this.prisma.service.create({
        data: {
          name: 'SETTING',
        },
      });
    }
  }
}
