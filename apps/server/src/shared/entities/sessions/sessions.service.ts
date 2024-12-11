import { Injectable } from '@nestjs/common';
import { UpdateSessionDto } from './dtos/update-session.dto';
import { SessionsRepository } from './sessions.repository';
import { SessionPageQueryDto } from './dtos/session-page-query.dto';
import { Prisma } from '@prisma/client';
import { PaginationUtil } from '@shared/utils';

@Injectable()
export class SessionsService {
  constructor(private readonly repository: SessionsRepository) {}

  getUnique(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  getFirst(id: string) {
    return this.repository.findFirst({ where: { id } });
  }

  removeMany(ids: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        removedAt: new Date(),
      },
    });
  }

  delete(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(args: Prisma.SessionCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(pageQuery: SessionPageQueryDto) {
    const args = PaginationUtil.toArgs(pageQuery);
    const sessions = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      sessions,
      count,
    };
  }

  async update(sessionId: string, updateSessionDto: UpdateSessionDto) {
    return this.repository.update({
      where: { id: sessionId },
      data: updateSessionDto,
    });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
