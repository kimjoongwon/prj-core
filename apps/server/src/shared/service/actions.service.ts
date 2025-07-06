import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { ActionsRepository } from '../repository/actions.repository';
import { QueryActionDto, CreateActionDto } from '@shared/schema';

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
      data: createActionDto as any,
    });
  }

  async getManyByQuery(query: QueryActionDto) {
    const args = query.toArgs<Prisma.ActionFindManyArgs>();
    const countArgs = query.toCountArgs<Prisma.ActionCountArgs>();
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
