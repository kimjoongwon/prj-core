import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateServiceDto } from './dto/create-service.dto';
import { SERVICE_NAME } from '@prisma/client';

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
