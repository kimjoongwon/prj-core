import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dtos/create-session.dto';
import { UpdateSessionDto } from './dtos/update-session.dto';
import { SessionsRepository } from './sessions.repository';
import { SessionPageQueryDto } from './dtos/session-page-query.dto';
import { PaginationMananger } from '../../utils';
import { IService } from '../../types/interfaces/service.interface';

@Injectable()
export class SessionsService implements IService {
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

  create(createSessionDto: CreateSessionDto) {
    return this.repository.create({ data: createSessionDto });
  }

  async getManyByQuery(pageQuery: SessionPageQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
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
