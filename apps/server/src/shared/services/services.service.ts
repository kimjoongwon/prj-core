import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateServiceDto, UpdateServiceDto } from '../dtos';

@Injectable()
export class ServicesService {
  logger = new Logger(ServicesService.name);
  constructor(private readonly prisma: PrismaService) {}

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

  getServiceById(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
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
