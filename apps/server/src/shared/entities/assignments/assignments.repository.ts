import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IRepository } from '../../types/interfaces/repository.interface';

@Injectable()
export class AssignmentsRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.AssignmentCreateArgs) {
    return this.prisma.assignment.create(args);
  }

  upsert(args: Prisma.AssignmentUpsertArgs) {
    return this.prisma.assignment.upsert(args);
  }

  update(args: Prisma.AssignmentUpdateArgs) {
    return this.prisma.assignment.update(args);
  }

  updateMany(args: Prisma.AssignmentUpdateManyArgs) {
    return this.prisma.assignment.updateMany(args);
  }

  delete(args: Prisma.AssignmentDeleteArgs) {
    return this.prisma.assignment.delete(args);
  }

  findMany(args: Prisma.AssignmentFindManyArgs) {
    return this.prisma.assignment.findMany({
      ...args,
      where: {
        removedAt: null,
        ...args.where,
      },
      orderBy: {
        ...args.orderBy,
      },
    });
  }

  findUnique(args: Prisma.AssignmentFindUniqueArgs) {
    return this.prisma.assignment.findUnique(args);
  }

  findFirst(args: Prisma.AssignmentFindFirstArgs) {
    return this.prisma.assignment.findFirst(args);
  }

  count(args: Prisma.AssignmentCountArgs) {
    return this.prisma.assignment.count(args);
  }
}
