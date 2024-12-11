import { Injectable } from '@nestjs/common';
import { ClassificationsRepository } from './classifications.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClassificationsService {
  constructor(private readonly repository: ClassificationsRepository) {}
  updateMany(args: unknown): unknown {
    throw new Error('Method not implemented.');
  }

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

  async getManyByQuery(args: Prisma.ClassificationFindManyArgs) {
    const classifications = await this.repository.findMany(args);
    const count = await this.repository.count(args as Prisma.ClassificationCountArgs);

    return {
      classifications,
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
