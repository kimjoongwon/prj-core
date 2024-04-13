import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateServiceDto } from './dto/create-service.dto';
import { SERVICE_NAME } from '@prisma/client';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  createServices() {
    return this.prisma.service.createMany({
      data: [
        {
          name: SERVICE_NAME.settingService,
        },
        {
          name: SERVICE_NAME.userService,
        },
      ],
      skipDuplicates: true,
    });
  }

  getServiceForm() {
    return {
      defaultObject: {
        name: SERVICE_NAME.userService,
      },
      form: {
        nameOptions: [
          {
            text: '설정 서비스',
            value: SERVICE_NAME.settingService,
          },
          {
            text: '유저 서비스',
            value: SERVICE_NAME.userService,
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
