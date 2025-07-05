import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SubjectsRepository } from '../repository/subjects.repository';
import { CreateSubjectDto, QuerySubjectDto } from '../dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly repository: SubjectsRepository) {}

  getUnique(args: Prisma.SubjectFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.SubjectFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.SubjectUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createSubjectDto: CreateSubjectDto) {
    return this.repository.create({
      data: createSubjectDto,
    });
  }

  async getManyByQuery(query?: QuerySubjectDto) {
    const args = query?.toArgs();
    const countArgs = query?.toCountArgs();
    const subjects = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      subjects,
      count,
    };
  }

  update(args: Prisma.SubjectUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
