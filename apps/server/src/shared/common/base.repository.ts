import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

export class BaseService<
  CreateArgs,
  UpsertArgs,
  UpdateArgs,
  UpdateManyArgs,
  DeleteArgs,
  FindManyArgs,
  CountArgs,
  AggregateArgs,
  DeleteManyArgs,
  FindFirstArgs,
  FindUniqueArgs,
  GroupByArgs,
  CreateManyAndReturnArgs,
> {
  constructor(
    private prisma: PrismaService,
    private model: Prisma.ModelName,
  ) {}

  create(args: CreateArgs) {
    return this.prisma[this.model.toLowerCase()].create(args);
  }

  upsert(args: UpsertArgs) {
    return this.prisma[this.model.toLowerCase()].upsert(args);
  }

  update(args: UpdateArgs) {
    return this.prisma[this.model.toLowerCase()].update(args);
  }

  updateMany(args: UpdateManyArgs) {
    return this.prisma[this.model.toLowerCase()].updateMany(args);
  }

  delete(args: DeleteArgs) {
    return this.prisma[this.model.toLowerCase()].delete(args);
  }

  findMany(args: FindManyArgs) {
    return this.prisma[this.model.toLowerCase()].findMany(args);
  }

  findFirstOrThrow(args: FindFirstArgs) {
    return this.prisma[this.model.toLowerCase()].findFirstOrThrow(args);
  }

  findUniqueOrThrow(args: FindUniqueArgs) {
    return this.prisma[this.model.toLowerCase()].findUniqueOrThrow(args);
  }

  groupBy(args: GroupByArgs) {
    return this.prisma[this.model.toLowerCase()].groupBy(args);
  }

  createManyAndReturn(args: CreateManyAndReturnArgs) {
    return this.prisma[this.model.toLowerCase()].createManyAndReturn(args);
  }

  deleteMany(args: DeleteManyArgs) {
    return this.prisma[this.model.toLowerCase()].deleteMany(args);
  }

  aggregate(args: AggregateArgs) {
    return this.prisma[this.model.toLowerCase()].aggregate(args);
  }

  count(args: CountArgs) {
    return this.prisma[this.model.toLowerCase()].count(args);
  }
}
