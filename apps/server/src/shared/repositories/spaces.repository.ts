import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpacesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.SpaceCreateArgs) {
    return this.prisma.space.create(args);
  }

  upsert(args: Prisma.SpaceUpsertArgs) {
    return this.prisma.space.upsert(args);
  }

  update(args: Prisma.SpaceUpdateArgs) {
    return this.prisma.space.update(args);
  }

  updateMany(args: Prisma.SpaceUpdateManyArgs) {
    return this.prisma.space.updateMany(args);
  }

  delete(args: Prisma.SpaceDeleteArgs) {
    return this.prisma.space.delete(args);
  }

  findMany(args: Prisma.SpaceFindManyArgs) {
    return this.prisma.space.findMany(args);
  }

  findUnique(args: Prisma.SpaceFindUniqueArgs) {
    return this.prisma.space.findUnique(args);
  }

  findFirst(args: Prisma.SpaceFindFirstArgs) {
    return this.prisma.space.findFirst(args);
  }

  count(args: Prisma.SpaceCountArgs) {
    return this.prisma.space.count(args);
  }
}
