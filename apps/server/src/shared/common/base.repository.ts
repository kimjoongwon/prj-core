import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Constructor } from '../decorators/use-dto.decorator';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly model: Prisma.ModelName,
  ) {}

  private entityClass?: Constructor<any, any>;

  async create(args: CreateArgs): Promise<R> {
    const result = await this.prisma[this.model.toLowerCase()].create(args);
    return plainToInstance(this.entityClass, result as R);
  }

  async upsert(args: UpsertArgs): Promise<R> {
    const result = await this.prisma[this.model.toLowerCase()].upsert(args);
    return plainToInstance(this.entityClass, result as R);
  }

  async update(args: UpdateArgs): Promise<R> {
    const result = await this.prisma[this.model.toLowerCase()].update(args);
    return plainToInstance(this.entityClass, result as R);
  }

  async updateMany(args: UpdateManyArgs): Promise<Prisma.BatchPayload> {
    const result = await this.prisma[this.model.toLowerCase()].updateMany(args);
    return plainToInstance(this.entityClass, result as R);
  }

  async delete(args: DeleteArgs): Promise<R> {
    const result = await this.prisma[this.model.toLowerCase()].delete(args);
    return plainToInstance(this.entityClass, result as R);
  }

  async findMany(args: FindManyArgs): Promise<R[]> {
    const result = await this.prisma[this.model.toLowerCase()].findMany(args);
    return result.map((item) => plainToInstance(this.entityClass, item as R));
  }

  async findFirst(args: FindFirstArgs): Promise<R> {
    const result = await this.prisma[this.model.toLowerCase()].findFirst(args);
    return plainToInstance(this.entityClass, result as R);
  }

  async findUnique(args: FindUniqueArgs): Promise<R> {
    const result = await this.prisma[this.model.toLowerCase()].findUnique(args);
    return plainToInstance(this.entityClass, result as R);
  }

  async groupBy(args: GroupByArgs): Promise<any> {
    const result = await this.prisma[this.model.toLowerCase()].groupBy(args);
    return result;
  }

  async createManyAndReturn(args: CreateManyAndReturnArgs): Promise<R[]> {
    const result = await this.prisma[this.model.toLowerCase()].createManyAndReturn(args);
    return result.map((item) => plainToInstance(this.entityClass, item as R));
  }

  async deleteMany(args: DeleteManyArgs): Promise<Prisma.BatchPayload> {
    const result = await this.prisma[this.model.toLowerCase()].deleteMany(args);
    return result;
  }

  async aggregate(args: AggregateArgs): Promise<R[]> {
    const result = await this.prisma[this.model.toLowerCase()].aggregate(args);
    return result.map((item) => plainToInstance(this.entityClass, item as R));
  }

  async count(args: CountArgs): Promise<number> {
    return this.prisma[this.model.toLowerCase()].count(args);
  }
}
