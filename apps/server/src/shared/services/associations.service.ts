import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AssociationsRepository } from '../repositories/associations.repository';
import { AssociationQueryDto } from '../dtos/query/association-query.dto';
import { CreateAssociationDto } from '../dtos';

@Injectable()
export class AssociationsService {
  constructor(private readonly repository: AssociationsRepository) {}

  getUnique(args: Prisma.AssociationFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.AssociationFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.AssociationUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createAssociationDto: CreateAssociationDto) {
    return this.repository.create({
      data: createAssociationDto,
    });
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
