import { Logger } from '@nestjs/common';
import type { Prisma } from '@shared/schema';
import { plainToInstance } from 'class-transformer';
import type { PrismaService } from 'nestjs-prisma';
import type { Constructor } from '../decorator/use-dto.decorator';

export class BaseRepository<
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
  R,
> {
  private readonly logger: Logger;
  private entityClass?: Constructor<any, any>;

  constructor(
    readonly prisma: PrismaService,
    readonly model: Prisma.ModelName
  ) {
    this.logger = new Logger(this.model);
  }

  async create(args: CreateArgs): Promise<R> {
    this.logger.debug(`Creating ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].create(args);
    return this.entityClass ? plainToInstance(this.entityClass, result) : result;
  }

  async upsert(args: UpsertArgs): Promise<R> {
    this.logger.debug(`Upserting ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].upsert(args);
    return this.entityClass ? plainToInstance(this.entityClass, result) : result;
  }

  async update(args: UpdateArgs): Promise<R> {
    this.logger.debug(`Updating ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].update(args);
    return this.entityClass ? plainToInstance(this.entityClass, result) : result;
  }

  async updateMany(args: UpdateManyArgs): Promise<Prisma.BatchPayload> {
    this.logger.debug(`Updating many ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].updateMany(args);
    return result;
  }

  async delete(args: DeleteArgs): Promise<R> {
    this.logger.debug(`Deleting ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].delete(args);
    return this.entityClass ? plainToInstance(this.entityClass, result) : result;
  }

  async findMany(args: FindManyArgs): Promise<R[]> {
    this.logger.debug(`Finding many ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].findMany(args);
    if (this.entityClass) {
      return result.map((item: any) => plainToInstance(this.entityClass!, item));
    }
    return result;
  }

  async findFirst(args: FindFirstArgs): Promise<R> {
    this.logger.debug(`Finding first ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].findFirst(args);
    return this.entityClass ? plainToInstance(this.entityClass, result) : result;
  }

  async findUnique(args: FindUniqueArgs): Promise<R> {
    this.logger.debug(`Finding unique ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].findUnique(args);
    return this.entityClass ? plainToInstance(this.entityClass, result) : result;
  }

  async groupBy(args: GroupByArgs): Promise<any> {
    this.logger.debug(`Grouping by ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].groupBy(args);
    return result;
  }

  async createManyAndReturn(args: CreateManyAndReturnArgs): Promise<R[]> {
    this.logger.debug(`Creating many ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].createManyAndReturn(args);
    if (this.entityClass) {
      return result.map((item: any) => plainToInstance(this.entityClass!, item));
    }
    return result;
  }

  async deleteMany(args: DeleteManyArgs): Promise<Prisma.BatchPayload> {
    this.logger.debug(`Deleting many ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].deleteMany(args);
    return result;
  }

  async aggregate(args: AggregateArgs): Promise<any> {
    this.logger.debug(`Aggregating ${this.model}...`);
    const result = await (this.prisma as any)[this.model.toLowerCase()].aggregate(args);
    return result;
  }

  async count(args: CountArgs): Promise<number> {
    this.logger.debug(`Counting ${this.model}...`);
    return (this.prisma as any)[this.model.toLowerCase()].count(args);
  }
}
