import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TimelineRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(args: Prisma.TimelineCreateArgs) {
    return this.prisma.timeline.create(args);
  }

  createMany(args: Prisma.TimelineCreateManyArgs) {
    return this.prisma.timeline.createMany(args);
  }

  findManyBySessionId(sessionId: string) {
    return this.prisma.timeline.findMany({
      where: {
        sessionId,
        removedAt: null,
      },
    });
  }

  update(args: Prisma.TimelineUpdateArgs) {
    return this.prisma.timeline.update(args);
  }

  removeById(id: string) {
    return this.prisma.timeline.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }

  removeManyByIds(ids: string[]) {
    return this.prisma.timeline.updateMany({
      where: { id: { in: ids } },
      data: { removedAt: new Date() },
    });
  }

  delete(args: Prisma.TimelineDeleteArgs) {
    return this.prisma.timeline.delete(args);
  }

  deleteMany(args: Prisma.TimelineDeleteManyArgs) {
    return this.prisma.timeline.deleteMany(args);
  }
}
