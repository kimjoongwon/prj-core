import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dtos/create-session.dto';
import { UpdateSessionDto } from './dtos/update-session.dto';
import { SessionRepository } from './session.repository';
import { SessionPageQueryDto } from './dtos/session-page-query.dto';
import { PaginationMananger } from 'src/shared/utils';

@Injectable()
export class SessionService {
  constructor(private readonly repository: SessionRepository) {}

  create(createSessionDto: CreateSessionDto) {
    return this.repository.create({ data: createSessionDto });
  }

  getSessionsByPageQuery(pageQuery: SessionPageQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
    return this.repository.findMany(args);
  }

  findOne(id: number) {
    return `This action returns a #${id} session`;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
