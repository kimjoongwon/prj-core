import { BadRequestException, Injectable } from '@nestjs/common';
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

  create({ sessionIds, ...createTimelineDto }: CreateTimelineDto) {
    const isAll = sessionIds.find((id) => id === 'all');

    if (isAll) {
      throw new BadRequestException('전체 세션을 선택할 수 없습니다.');
    }

    return this.repository.create({
      data: {
        ...createTimelineDto,
        sessions: { connect: sessionIds?.map((id) => ({ id })) },
      },
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
