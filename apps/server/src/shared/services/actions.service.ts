import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ActionsRepository } from '../repositories/actions.repository';
import { ActionQueryDto } from '../dtos/query/action-query.dto';
import { CreateActionDto } from '../dtos';

@Injectable()
export class ActionsService {
  constructor(private readonly repository: ActionsRepository) {}

  getUnique(args: Prisma.ActionFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.ActionFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.ActionUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createActionDto: CreateActionDto) {
    return this.repository.create({
      data: createActionDto,
    });
  }

  async getManyByQuery(query: ActionQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const actions = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      actions,
      count,
    };
  }

  update(args: Prisma.ActionUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
