import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dtos/create-session.dto';
import { UpdateSessionDto } from './dtos/update-session.dto';
import { SessionRepository } from './session.repository';
import { SessionPageQueryDto } from './dtos/session-page-query.dto';
import { TimelineService } from '../timeline/timeline.service';
import { CreateTimelineDto } from '../timeline/dto';
import { PaginationMananger } from '../../utils';
import { R } from '../../libs/remeda';
import { IService } from 'src/shared/types';

@Injectable()
export class SessionService implements IService {
  constructor(
    private readonly repository: SessionRepository,
    private readonly timelineService: TimelineService,
  ) {}

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

  async update(updateSessionDto: UpdateSessionDto) {
    const { id: sessionId } = updateSessionDto;
    const timelines = await this.timelineService.getManyById(sessionId);
    const timelineIds = timelines.map((timeline) => timeline.id);
    await this.timelineService.removeManyByIds(timelineIds);

    const createTimelineDtos: CreateTimelineDto[] = updateSessionDto.timelineDates.map(
      (timelineDate) => ({
        tenantId: 'hihih',
        timelineItemId: null,
        date: timelineDate,
        sessionId,
      }),
    );

    await this.timelineService.createMany(createTimelineDtos);

    const omittedUpdateSessionDto = R.omit(updateSessionDto, ['timelineDates']);

    return this.repository.update({ where: { id: sessionId }, data: omittedUpdateSessionDto });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
