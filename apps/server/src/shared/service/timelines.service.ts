import { Injectable } from "@nestjs/common";
import { CreateTimelineDto, Prisma, QueryTimelineDto } from "@shared/schema";
import { TimelinesRepository } from "../repository/timeline.repository";

@Injectable()
export class TimelinesService {
  constructor(private readonly repository: TimelinesRepository) {}

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

  create(createTimeline: CreateTimelineDto) {
    return this.repository.create({
      data: createTimeline,
    });
  }

  async getManyByQuery(query: QueryTimelineDto) {
    const args = query.toArgs<Prisma.TimelineFindManyArgs>();
    const countArgs = query.toCountArgs<Prisma.TimelineCountArgs>();
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
