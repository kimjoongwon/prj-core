import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ClassificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.ClassificationCreateArgs) {
    return this.prisma.classification.create(args);
  }

  upsert(args: Prisma.ClassificationUpsertArgs) {
    return this.prisma.classification.upsert(args);
  }

  update(args: Prisma.ClassificationUpdateArgs) {
    return this.prisma.classification.update(args);
  }

  updateMany(args: Prisma.ClassificationUpdateManyArgs) {
    return this.prisma.classification.updateMany(args);
  }

  delete(args: Prisma.ClassificationDeleteArgs) {
    return this.prisma.classification.delete(args);
  }

  findMany(args: Prisma.ClassificationFindManyArgs) {
    return this.prisma.classification.findMany(args);
  }

  findUnique(args: Prisma.ClassificationFindUniqueArgs) {
    return this.prisma.classification.findUnique(args);
  }

  findFirst(args: Prisma.ClassificationFindFirstArgs) {
    return this.prisma.classification.findFirst(args);
  }

  count(args: Prisma.ClassificationCountArgs) {
    return this.prisma.classification.count(args);
  }

  createMany(args: Prisma.ClassificationCreateManyArgs) {
    return this.prisma.classification.createMany(args);
  }
}
