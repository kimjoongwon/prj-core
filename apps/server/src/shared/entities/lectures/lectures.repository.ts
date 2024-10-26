import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IRepository } from '../../types/interfaces/repository.interface';

@Injectable()
export class LecturesRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.LectureCreateArgs) {
    return this.prisma.lecture.create(args);
  }

  upsert(args: Prisma.LectureUpsertArgs) {
    return this.prisma.lecture.upsert(args);
  }

  update(args: Prisma.LectureUpdateArgs) {
    return this.prisma.lecture.update(args);
  }

  updateMany(args: Prisma.LectureUpdateManyArgs) {
    return this.prisma.lecture.updateMany(args);
  }

  delete(args: Prisma.LectureDeleteArgs) {
    return this.prisma.lecture.delete(args);
  }

  findMany(args: Prisma.LectureFindManyArgs) {
    return this.prisma.lecture.findMany(args);
  }

  findUnique(args: Prisma.LectureFindUniqueArgs) {
    return this.prisma.lecture.findUnique(args);
  }

  findFirst(args: Prisma.LectureFindFirstArgs) {
    return this.prisma.lecture.findFirst(args);
  }

  count(args: Prisma.LectureCountArgs) {
    return this.prisma.lecture.count(args);
  }
}
