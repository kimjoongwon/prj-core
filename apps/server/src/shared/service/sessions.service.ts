import { Injectable } from '@nestjs/common';
import { CreateSessionDto, Prisma, QuerySessionDto } from '@shared/schema';
import { SessionsRepository } from '../repository/sessions.repository';

@Injectable()
export class SessionsService {
  constructor(private readonly repository: SessionsRepository) {}

  getUnique(args: Prisma.SessionFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.SessionFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.SessionUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createSessionDto: CreateSessionDto) {
    return this.repository.create({
      data: createSessionDto,
    });
  }

  async getManyByQuery(query: QuerySessionDto) {
    const args = query.toArgs<Prisma.SessionFindManyArgs>();
    const countArgs = query.toCountArgs<Prisma.SessionCountArgs>();
    const sessions = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      sessions,
      count,
    };
  }

  update(args: Prisma.SessionUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
