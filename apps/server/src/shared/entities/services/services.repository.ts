import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ServicesRepository {
  constructor(private prisma: PrismaService) {}
  create(args: Prisma.ServiceCreateArgs) {
    return this.prisma.service.create(args);
  }

  findMany(args: Prisma.ServiceFindManyArgs) {
    return this.prisma.service.findMany(args);
  }

  findFirst(args: Prisma.ServiceFindFirstArgs) {
    return this.prisma.service.findFirst(args);
  }

  findUnique(args: Prisma.ServiceFindUniqueArgs) {
    return this.prisma.service.findUnique(args);
  }

  update(args: Prisma.ServiceUpdateArgs) {
    return this.prisma.service.update(args);
  }

  updateMany(args: Prisma.ServiceUpdateManyArgs) {
    return this.prisma.service.updateMany(args);
  }

  delete(args: Prisma.ServiceDeleteArgs) {
    return this.prisma.service.delete(args);
  }
}
