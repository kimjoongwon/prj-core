import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TimelineRepository } from '../repositories/timeline.repository';
import { CreateTimelineDto, TimelineQueryDto } from '../dtos';

@Injectable()
export class TimelineService {
  constructor(private readonly repository: TimelineRepository) {}

  getUnique(args: Prisma.TimelineFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.TimelineFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.TimelineUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createTimelineDto: CreateTimelineDto) {
    return this.repository.create({
      data: createTimelineDto,
    });
  }

  async getManyByQuery(query: TimelineQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const timelines = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      timelines,
      count,
    };
  }

  update(args: Prisma.TimelineUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
