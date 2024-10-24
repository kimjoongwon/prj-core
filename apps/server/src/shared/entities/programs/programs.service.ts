import { Injectable } from '@nestjs/common';
import { ProgramsRepository } from './programs.repository';
import { PaginationMananger } from '../../utils';
import { IService } from '../../types/interfaces/service.interface';
import { Prisma } from '@prisma/client';
import { ProgramQueryDto } from './dtos/program-query.dto';

@Injectable()
export class ProgramsService implements IService {
  constructor(private readonly repository: ProgramsRepository) {}

  updateMany(args: Prisma.ProgramUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  getUnique(args: Prisma.ProgramFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.ProgramFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  delete(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(args: Prisma.ProgramCreateArgs) {
    return this.repository.create(args);
  }

  async getManyByQuery(pageQuery: ProgramQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
    const programs = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      programs,
      count,
    };
  }

  update(args: Prisma.ProgramUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
