import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IRepository } from '../../types/interfaces/repository.interface';

@Injectable()
export class PostRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.PostCreateArgs) {
    return this.prisma.post.create(args);
  }

  upsert(args: Prisma.PostUpsertArgs) {
    return this.prisma.post.upsert(args);
  }

  update(args: Prisma.PostUpdateArgs) {
    return this.prisma.post.update(args);
  }

  updateMany(args: Prisma.PostUpdateManyArgs) {
    return this.prisma.post.updateMany(args);
  }

  delete(args: Prisma.PostDeleteArgs) {
    return this.prisma.post.delete(args);
  }

  findMany(args: Prisma.PostFindManyArgs) {
    return this.prisma.post.findMany({
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

  findUnique(args: Prisma.PostFindUniqueArgs) {
    return this.prisma.post.findUnique(args);
  }

  findFirst(args: Prisma.PostFindFirstArgs) {
    return this.prisma.post.findFirst(args);
  }

  count(args: Prisma.PostCountArgs) {
    return this.prisma.post.count(args);
  }
}
