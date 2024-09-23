import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { ServiceQueryDto } from './dtos';
import { PaginationMananger } from '../../utils';
import { UpsertServiceDto } from './dtos/upsert-service.dto';

@Injectable()
export class ServicesService {
  logger = new Logger(ServicesService.name);
  constructor(private readonly prisma: PrismaService) {}

  create(createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: createServiceDto,
    });
  }

  upsert(upsertServiceDto: UpsertServiceDto) {
    return this.prisma.service.upsert({
      where: { name: upsertServiceDto.name },
      create: upsertServiceDto,
      update: upsertServiceDto,
    });
  }

  findManyByQuery(query: ServiceQueryDto) {
    const args = PaginationMananger.toArgs(query);
    return this.prisma.service.findMany(args);
  }

  getAll() {
    return this.prisma.service.findMany({
      where: {
        removedAt: null,
      },
    });
  }

  getUnqiue(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  getFirst(id: string) {
    return this.prisma.service.findFirst({
      where: { id },
    });
  }

  update(id: string, updateServiceDto: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  remove(id: string) {
    return this.prisma.service.update({
      where: { id },
      data: {
        removedAt: new Date(),
      },
    });
  }

  removeMany(ids: string[]) {
    return this.prisma.service.updateMany({
      where: { id: { in: ids } },
      data: { removedAt: new Date() },
    });
  }

  delete(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
