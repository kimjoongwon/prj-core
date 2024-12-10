import { Injectable, Logger } from '@nestjs/common';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { ServiceQueryDto } from './dtos';
import { PaginationMananger } from '../../utils';
import { ServicesRepository } from './services.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicesService {
  logger = new Logger(ServicesService.name);
  constructor(private readonly repository: ServicesRepository) {}

  create(args: Prisma.ServiceCreateArgs) {
    return this.repository.create(args);
  }

  findManyByQuery(query: ServiceQueryDto) {
    const args = PaginationMananger.toArgs(query);
    return this.repository.findMany(args);
  }

  getAll() {
    return this.repository.findMany({
      where: {
        removedAt: null,
      },
    });
  }

  getUnique(args: Prisma.ServiceFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(id: string) {
    return this.repository.findFirst({
      where: { id },
    });
  }

  update(id: string, updateServiceDto: UpdateServiceDto) {
    return this.repository.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: {
        removedAt: new Date(),
      },
    });
  }

  removeMany(ids: string[]) {
    return this.repository.updateMany({
      where: { id: { in: ids } },
      data: { removedAt: new Date() },
    });
  }

  delete(id: string) {
    return this.repository.delete({
      where: { id },
    });
  }
}
