import { Injectable } from '@nestjs/common';
import { LecturesRepository } from './lectures.repository';
import { PaginationMananger } from '../../utils';
import { IService } from '../../types/interfaces/service.interface';
import { Prisma } from '@prisma/client';
import { LectureQueryDto } from './dtos/lecture-query.dto';

@Injectable()
export class LecturesService implements IService {
  constructor(private readonly repository: LecturesRepository) {}

  updateMany(args: Prisma.LectureUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  getUnique(args: Prisma.LectureFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.LectureFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  delete(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(args: Prisma.LectureCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(args: Prisma.LectureFindManyArgs) {
    const lectures = await this.repository.findMany(args);
    const count = await this.repository.count(args as Prisma.LectureCountArgs);
    return {
      lectures,
      count,
    };
  }

  update(args: Prisma.LectureUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
