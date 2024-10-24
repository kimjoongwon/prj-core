import { Injectable } from '@nestjs/common';
import { AssignmentsRepository } from './assignments.repository';
import { AssignmentPageQueryDto } from './dtos/assignment-page-query.dto';
import { PaginationMananger } from '../../utils';
import { IService } from '../../types/interfaces/service.interface';
import { Prisma } from '@prisma/client';
import { AssignmentDto } from './dtos';

@Injectable()
export class AssignmentsService implements IService {
  constructor(private readonly repository: AssignmentsRepository) {}

  getUnique(args: Prisma.AssignmentFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  createMany(args: Prisma.AssignmentCreateManyArgs) {
    return this.repository.createMany(args);
  }

  getFirst(args: Prisma.AssignmentFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.AssignmentUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  delete(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(args: Prisma.AssignmentCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(pageQuery: AssignmentPageQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
    const assignments: AssignmentDto[] = await this.repository.findMany({
      ...args,
      where: {
        ...args.where,
        removedAt: null,
      },
      include: {
        group: true,
        service: true,
      },
    });

    const assignmentsWithServiceItem = await Promise.all(
      assignments.map(async (assignment) => {
        const serviceItem = await this.repository.findServiceItem(assignment);

        return {
          ...assignment,
          [assignment.service.name]: serviceItem,
        };
      }),
    );

    const count = await this.repository.count(args);
    return {
      assignments: assignmentsWithServiceItem,
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
