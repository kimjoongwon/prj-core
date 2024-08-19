import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dtos/create-session.dto';
import { UpdateSessionDto } from './dtos/update-session.dto';
import { SessionRepository } from './session.repository';
import { SessionPageQueryDto } from './dtos/session-page-query.dto';
import { TimelineService } from '../timeline/timeline.service';
import { CreateTimelineDto } from '../timeline/dto';
import { PaginationMananger } from '../../utils';
import { R } from '../../libs/remeda';

@Injectable()
export class SessionService {
  constructor(
    private readonly repository: SessionRepository,
    private readonly timelineService: TimelineService,
  ) {}

  create(createSessionDto: CreateSessionDto) {
    return this.repository.create({ data: createSessionDto });
  }

  getManyByPageQuery(pageQuery: SessionPageQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
    return this.repository.findMany(args);
  }

  async update(updateSessionDto: UpdateSessionDto) {
    const { id: sessionId } = updateSessionDto;
    const timelines = await this.timelineService.getManyById(sessionId);
    const timelineIds = timelines.map((timeline) => timeline.id);
    await this.timelineService.removeManyByIds(timelineIds);

    const createTimelineDtos: CreateTimelineDto[] = updateSessionDto.timelineDates.map(
      (timelineDate) => ({
        timelineItemId: null,
        date: timelineDate,
        sessionId,
      }),
    );

    await this.timelineService.createMany(createTimelineDtos);

    const omittedUpdateSessionDto = R.omit(updateSessionDto, ['timelineDates']);

    return this.repository.update({ where: { id: sessionId }, data: omittedUpdateSessionDto });
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
