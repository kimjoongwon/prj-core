import { Injectable } from '@nestjs/common';
import { PagesRepository } from './pages.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class PagesService {
  constructor(private readonly repository: PagesRepository) {}

  getUnique(args: Prisma.PageFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.PageFindFirstArgs) {
    return this.repository.findFirst(args);
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

  create(args: Prisma.PageCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(args: Prisma.PageFindManyArgs) {
    const pages = await this.repository.findMany(args);
    const count = await this.repository.count(args as Prisma.PageCountArgs);
    return {
      pages,
      count,
    };
  }

  update(args: Prisma.PageUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
