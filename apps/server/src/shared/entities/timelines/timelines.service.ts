import { Injectable } from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { TimelinesRepository } from './timelines.repository';

@Injectable()
export class TimelinesService {
  constructor(private readonly repository: TimelinesRepository) {}

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
