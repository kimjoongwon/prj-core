import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IRepository } from 'src/shared/types';

@Injectable()
export class SessionRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.SessionCreateArgs) {
    return this.prisma.session.create(args);
  }

  upsert(args: Prisma.SessionUpsertArgs) {
    return this.prisma.session.upsert(args);
  }

  update(args: Prisma.SessionUpdateArgs) {
    return this.prisma.session.update(args);
  }

  updateMany(args: Prisma.SessionUpdateManyArgs) {
    return this.prisma.session.updateMany(args);
  }

  delete(args: Prisma.SessionDeleteArgs) {
    return this.prisma.session.delete(args);
  }

  findMany(args: Prisma.SessionFindManyArgs) {
    return this.prisma.session.findMany({
      ...args,
      where: {
        removedAt: null,
        ...args.where,
      },
      orderBy: {
        createdAt: 'desc',
        ...args.orderBy,
      },
    });
  }

  findUnique(args: Prisma.SessionFindUniqueArgs) {
    return this.prisma.session.findUnique(args);
  }

  findFirst(args: Prisma.SessionFindFirstArgs) {
    return this.prisma.session.findFirst(args);
  }

  count(args: Prisma.SessionCountArgs) {
    return this.prisma.session.count(args);
  }
}
