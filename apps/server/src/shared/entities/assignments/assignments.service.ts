import { Injectable } from '@nestjs/common';
import { AssignmentsRepository } from './assignments.repository';
import { AssignmentPageQueryDto } from './dtos/assignment-page-query.dto';
import { PaginationMananger } from '../../utils';
import { IService } from '../../types/interfaces/service.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssignmentsService implements IService {
  constructor(private readonly repository: AssignmentsRepository) {}

  getUnique(args: Prisma.AssignmentFindUniqueArgs) {
    return this.repository.findUnique(args);
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

  create(args: Prisma.AssignmentCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(pageQuery: AssignmentPageQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
    const assignments = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      assignments,
      count,
    };
  }

  update(args: Prisma.AssignmentUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
