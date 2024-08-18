import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(args: Prisma.SessionCreateArgs) {
    return this.prisma.session.create(args);
  }

  update(args: Prisma.SessionUpdateArgs) {
    return this.prisma.session.update(args);
  }

  findMany(args: Prisma.SessionFindManyArgs) {
    return this.prisma.session.findMany(args);
  }

  findUnique(args: Prisma.SessionFindUniqueArgs) {
    return this.prisma.session.findUnique(args);
  }

  delete(args: Prisma.SessionDeleteArgs) {
    return this.prisma.session.delete(args);
  }
}
