import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.UserCreateArgs) {
    return this.prisma.user.create(args);
  }

  upsert(args: Prisma.UserUpsertArgs) {
    return this.prisma.user.upsert(args);
  }

  update(args: Prisma.UserUpdateArgs) {
    return this.prisma.user.update(args);
  }

  updateMany(args: Prisma.UserUpdateManyArgs) {
    return this.prisma.user.updateMany(args);
  }

  delete(args: Prisma.UserDeleteArgs) {
    return this.prisma.user.delete(args);
  }

  findMany(args: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany({
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

  findUnique(args: Prisma.UserFindUniqueArgs) {
    return this.prisma.user.findUnique(args);
  }

  findFirst(args: Prisma.UserFindFirstArgs) {
    return this.prisma.user.findFirst(args);
  }

  count(args: Prisma.UserCountArgs) {
    return this.prisma.user.count(args);
  }
}
