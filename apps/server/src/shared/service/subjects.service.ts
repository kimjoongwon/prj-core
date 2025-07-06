import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { SubjectsRepository } from '../repository/subjects.repository';
import { CreateSubjectDto, QuerySubjectDto } from '@shared/schema';

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
    const countArgs = query?.toCountArgs<Prisma.SubjectCountArgs>();
    const subjects = args ? await this.repository.findMany(args) : [];
    const count = countArgs ? await this.repository.count(countArgs) : 0;
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
