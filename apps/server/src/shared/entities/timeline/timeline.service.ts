import { Injectable } from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { TimelineRepository } from './timeline.repository';

@Injectable()
export class TimelineService {
  constructor(private readonly repository: TimelineRepository) {}

  createMany(createTimelineDtos: CreateTimelineDto[]) {
    return this.repository.createMany({
      data: createTimelineDtos,
    });
  }

  create(createTimelineDto: CreateTimelineDto) {
    return this.repository.create({ data: createTimelineDto });
  }

  getManyById(sessionId: string) {
    return this.repository.findManyBySessionId(sessionId);
  }

  removeById(timelineId: string) {
    return this.repository.removeById(timelineId);
  }

  removeManyByIds(timelineIds: string[]) {
    return this.repository.removeManyByIds(timelineIds);
  }
}
