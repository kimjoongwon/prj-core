import { Injectable } from '@nestjs/common';
import { AssociationsRepository } from '../../_repo/associations.repository';
import { Prisma } from '@prisma/client';
import { AssociationQueryDto } from './dtos';

@Injectable()
export class AssociationsService {
  constructor(private readonly repository: AssociationsRepository) {}

  getUnique(args: Prisma.AssociationFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  createMany(args: Prisma.AssociationCreateManyArgs) {
    return this.repository.createMany(args);
  }

  getFirst(args: Prisma.AssociationFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.AssociationUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  delete(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(args: Prisma.AssociationCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(query: AssociationQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const associations = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      associations,
      count,
    };
  }

  update(args: Prisma.AssociationUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
