import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsRepository } from './subjects.repository';
import { SubjectPageQueryDto } from './dto/subject-page-query.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly repository: SubjectsRepository) {}

  create(createSubjectDto: CreateSubjectDto) {
    return this.repository.create(createSubjectDto);
  }

  getManyByPageQuery(args: SubjectPageQueryDto) {
    return this.repository.findMany(args);
  }

  getOneById(id: string) {
    return this.repository.findUnique(id);
  }

  updateById(id: string, updateSubjectDto: UpdateSubjectDto) {
    return this.repository.update({ where: { id }, data: updateSubjectDto });
  }

  removeById(id: string) {
    return this.repository.delete({ where: { id } });
  }
}
