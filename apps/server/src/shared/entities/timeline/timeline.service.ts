import { Injectable } from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { TimelineRepository } from './timeline.repository';

@Injectable()
export class TimelineService {
  constructor(private readonly repository: TimelineRepository) {}
  create(createTimelineDto: CreateTimelineDto) {
    return this.repository.create({ data: createTimelineDto });
  }

  getManyBySessionId(sessionId: string) {
    return this.repository.findManyBySessionId(sessionId);
  }

  removeById(timelineId: string) {
    return this.repository.removeById(timelineId);
  }

  removeManyById(timelineIds: string[]) {
    return this.repository.removeManyByIds(timelineIds);
  }
}
