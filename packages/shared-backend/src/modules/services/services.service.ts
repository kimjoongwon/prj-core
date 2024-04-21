import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { SERVICE_NAME } from '@prisma/client';

@Injectable()
export class ServicesService {
  logger = new Logger(ServicesService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createServices() {
    this.logger.log('Create Services');

    const space = await this.prisma.service.findFirst({
      where: {
        name: SERVICE_NAME.SPACE,
      },
    });

    if (!space) {
      this.prisma.service.create({
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
      this.prisma.service.create({
        data: {
          name: SERVICE_NAME.USER,
        },
      });
    }
  }

  getServiceForm() {
    return {
      defaultObject: {
        name: 'user',
      },
      form: {
        nameOptions: [
          {
            text: '공간 서비스',
            value: 'space',
          },
          {
            text: '사용자 서비스',
            value: 'user',
          },
        ],
      },
      schema: {},
    };
  }

  findAllService() {
    return this.prisma.service.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  update(id: string, updateServiceDto: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  create(createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: createServiceDto,
    });
  }

  delete(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
