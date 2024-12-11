import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.RoleCreateArgs) {
    return this.prisma.role.create(args);
  }

  upsert(args: Prisma.RoleUpsertArgs) {
    return this.prisma.role.upsert(args);
  }

  update(args: Prisma.RoleUpdateArgs) {
    return this.prisma.role.update(args);
  }

  updateMany(args: Prisma.RoleUpdateManyArgs) {
    return this.prisma.role.updateMany(args);
  }

  delete(args: Prisma.RoleDeleteArgs) {
    return this.prisma.role.delete(args);
  }

  findMany(args: Prisma.RoleFindManyArgs) {
    return this.prisma.role.findMany({
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

  findUnique(args: Prisma.RoleFindUniqueArgs) {
    return this.prisma.role.findUnique(args);
  }

  findFirst(args: Prisma.RoleFindFirstArgs) {
    return this.prisma.role.findFirst(args);
  }

  count(args: Prisma.RoleCountArgs) {
    return this.prisma.role.count(args);
  }
}
