import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IRepository } from '../../types/interfaces/repository.interface';

@Injectable()
export class TemplateRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.TemplateCreateArgs) {
    return this.prisma.template.create(args);
  }

  upsert(args: Prisma.TemplateUpsertArgs) {
    return this.prisma.template.upsert(args);
  }

  update(args: Prisma.TemplateUpdateArgs) {
    return this.prisma.template.update(args);
  }

  updateMany(args: Prisma.TemplateUpdateManyArgs) {
    return this.prisma.template.updateMany(args);
  }

  delete(args: Prisma.TemplateDeleteArgs) {
    return this.prisma.template.delete(args);
  }

  findMany(args: Prisma.TemplateFindManyArgs) {
    return this.prisma.template.findMany({
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

  findUnique(args: Prisma.TemplateFindUniqueArgs) {
    return this.prisma.template.findUnique(args);
  }

  findFirst(args: Prisma.TemplateFindFirstArgs) {
    return this.prisma.template.findFirst(args);
  }

  count(args: Prisma.TemplateCountArgs) {
    return this.prisma.template.count(args);
  }
}
