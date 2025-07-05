import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { Action } from '@shared/schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
@UseEntity(Action)
export class ActionsRepository {
  private readonly logger = new Logger('Action');

  constructor(private readonly prisma: PrismaService) {}

  async create(args: Prisma.ActionCreateArgs): Promise<Action> {
    this.logger.debug('Creating Action...');
    const result = await this.prisma.action.create(args);
    return plainToInstance(Action, result);
  }

  async upsert(args: Prisma.ActionUpsertArgs): Promise<Action> {
    this.logger.debug('Upserting Action...');
    const result = await this.prisma.action.upsert(args);
    return plainToInstance(Action, result);
  }

  async update(args: Prisma.ActionUpdateArgs): Promise<Action> {
    this.logger.debug('Updating Action...');
    const result = await this.prisma.action.update(args);
    return plainToInstance(Action, result);
  }

  async updateMany(
    args: Prisma.ActionUpdateManyArgs,
  ): Promise<Prisma.BatchPayload> {
    this.logger.debug('Updating many Action...');
    return this.prisma.action.updateMany(args);
  }

  async delete(args: Prisma.ActionDeleteArgs): Promise<Action> {
    this.logger.debug('Deleting Action...');
    const result = await this.prisma.action.delete(args);
    return plainToInstance(Action, result);
  }

  async findMany(args: Prisma.ActionFindManyArgs): Promise<Action[]> {
    this.logger.debug('Finding many Action...');
    const result = await this.prisma.action.findMany(args);
    return result.map(item => plainToInstance(Action, item));
  }

  async findFirst(args: Prisma.ActionFindFirstArgs): Promise<Action | null> {
    this.logger.debug('Finding first Action...');
    const result = await this.prisma.action.findFirst(args);
    return result ? plainToInstance(Action, result) : null;
  }

  async findUnique(args: Prisma.ActionFindUniqueArgs): Promise<Action | null> {
    this.logger.debug('Finding unique Action...');
    const result = await this.prisma.action.findUnique(args);
    return result ? plainToInstance(Action, result) : null;
  }

  async groupBy(args: Prisma.ActionGroupByArgs) {
    this.logger.debug('Grouping by Action...');
    // Type assertion needed due to Prisma type inconsistency
    return this.prisma.action.groupBy(args as any);
  }

  async createManyAndReturn(
    args: Prisma.ActionCreateManyAndReturnArgs,
  ): Promise<Action[]> {
    this.logger.debug('Creating many Action...');
    const result = await this.prisma.action.createManyAndReturn(args);
    return result.map(item => plainToInstance(Action, item));
  }

  async deleteMany(
    args: Prisma.ActionDeleteManyArgs,
  ): Promise<Prisma.BatchPayload> {
    this.logger.debug('Deleting many Action...');
    return this.prisma.action.deleteMany(args);
  }

  async aggregate(args: Prisma.ActionAggregateArgs) {
    this.logger.debug('Aggregating Action...');
    return this.prisma.action.aggregate(args);
  }

  async count(args: Prisma.ActionCountArgs): Promise<number> {
    this.logger.debug('Counting Action...');
    return this.prisma.action.count(args);
  }
}
