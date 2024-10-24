import { Injectable } from '@nestjs/common';
import { LecturesRepository } from './lectures.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class LecturesService {
  constructor(private readonly repository: LecturesRepository) {}

  create(args: Prisma.LectureCreateArgs) {
    return this.repository.create(args);
  }

  update(args: Prisma.LectureUpdateArgs) {
    return this.repository.update(args);
  }

  getUnique(args: Prisma.LectureFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.LectureFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  remove(args: Prisma.LectureUpdateArgs) {
    return this.repository.update(args);
  }

  removeMany(args: Prisma.LectureUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  delete(args: Prisma.LectureDeleteArgs) {
    return this.repository.delete(args);
  }

  async getManyByQuery(args: Prisma.LectureFindManyArgs) {
    const lectureCount = await this.repository.count(args as Prisma.LectureCountArgs);
    const lectures = await this.repository.findMany(args);
    return {
      count: lectureCount,
      lectures,
    };
  }
}
