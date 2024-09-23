import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateSubjectDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubjectsRepository {
  constructor(private prisma: PrismaService) {}

  create(data: CreateSubjectDto) {
    return this.prisma.subject.create({
      data,
    });
  }

  async upsert(args: Prisma.SubjectUpsertArgs) {
    return this.prisma.subject.upsert(args);
  }

  findMany(args: Prisma.SubjectFindManyArgs) {
    return this.prisma.subject.findMany(args);
  }

  findUnique(id: string) {
    return this.prisma.subject.findUnique({
      where: {
        id,
      },
    });
  }

  update(args: Prisma.SubjectUpdateArgs) {
    return this.prisma.subject.update(args);
  }

  delete(args: Prisma.SubjectDeleteArgs) {
    return this.prisma.subject.delete(args);
  }
}
