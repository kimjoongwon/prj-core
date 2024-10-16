import { Injectable } from '@nestjs/common';
import { ClassificationsRepository } from './classifications.repository';
import { ClassificationQueryDto } from './dtos/classification-query.dto';
import { PaginationMananger } from '../../utils';
import { IService } from '../../types/interfaces/service.interface';
import { Prisma } from '@prisma/client';
import { ClassificationDto } from './dtos';

@Injectable()
export class ClassificationsService implements IService {
  constructor(private readonly repository: ClassificationsRepository) {}

  getUnique(args: Prisma.ClassificationFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  createMany(args: Prisma.ClassificationCreateManyArgs) {
    return this.repository.createMany(args);
  }

  getFirst(id: string) {
    return this.repository.findFirst({ where: { id } });
  }

  removeMany(ids: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        removedAt: new Date(),
      },
    });
  }

  delete(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(args: Prisma.ClassificationCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(query: ClassificationQueryDto) {
    const args = PaginationMananger.toArgs(query);

    const classifications: ClassificationDto[] = await this.repository.findMany({
      ...args,
      where: {
        ...args.where,
        removedAt: null,
      },
      include: {
        category: true,
        service: true,
      },
    });

    const classificationsWithServiceItem = await Promise.all(
      classifications.map(async (classification) => {
        const serviceItem = await this.repository.findServiceItem(classification);
        console.log('serviceItem', serviceItem);
        return {
          ...classification,
          [classification.service.name]: serviceItem,
        };
      }),
    );

    const count = await this.repository.count(args);
    return {
      classifications: classificationsWithServiceItem,
      count,
    };
  }

  update(args: Prisma.ClassificationUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
