import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AssociationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.AssociationCreateArgs) {
    return this.prisma.association.create(args);
  }

  upsert(args: Prisma.AssociationUpsertArgs) {
    return this.prisma.association.upsert(args);
  }

  update(args: Prisma.AssociationUpdateArgs) {
    return this.prisma.association.update(args);
  }

  updateMany(args: Prisma.AssociationUpdateManyArgs) {
    return this.prisma.association.updateMany(args);
  }

  delete(args: Prisma.AssociationDeleteArgs) {
    return this.prisma.association.delete(args);
  }

  findMany(args: Prisma.AssociationFindManyArgs) {
    return this.prisma.association.findMany(args);
  }

  findUnique(args: Prisma.AssociationFindUniqueArgs) {
    return this.prisma.association.findUnique(args);
  }

  findFirst(args: Prisma.AssociationFindFirstArgs) {
    return this.prisma.association.findFirst(args);
  }

  count(args: Prisma.AssociationCountArgs) {
    return this.prisma.association.count(args);
  }

  createMany(args: Prisma.AssociationCreateManyArgs) {
    return this.prisma.association.createMany(args);
  }
}
