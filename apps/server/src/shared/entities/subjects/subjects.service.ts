import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsRepository } from './subjects.repository';
import { SubjectPageQueryDto } from './dto/subject-page-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubjectsService {
  constructor(private readonly repository: SubjectsRepository) {}

  create(args: Prisma.SubjectCreateArgs) {
    return this.repository.create(args);
  }

  getUnique(args: Prisma.SubjectFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  createOrUpdate(createSubjectDto: CreateSubjectDto) {
    return this.repository.upsert({
      where: { name: createSubjectDto.name },
      create: createSubjectDto,
      update: createSubjectDto,
    });
  }

  getManyByPageQuery(args: SubjectPageQueryDto) {
    return this.repository.findMany(args);
  }

  getOneById(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  updateById(id: string, updateSubjectDto: UpdateSubjectDto) {
    return this.repository.update({ where: { id }, data: updateSubjectDto });
  }

  removeById(id: string) {
    return this.repository.delete({ where: { id } });
  }
}
