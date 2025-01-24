import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProgramsRepository } from '../repositories/programs.repository';
import { CreateProgramDto, ProgramQueryDto } from '../dtos';

@Injectable()
export class ProgramsService {
  constructor(private readonly repository: ProgramsRepository) {}

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  removeManyByIds(programIds: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: programIds,
        },
      },
      data: { removedAt: new Date() },
    });
  }

  delete(args: Prisma.ProgramDeleteArgs) {
    return this.repository.delete(args);
  }

  deleteById(id: string) {
    return this.repository.delete({
      where: { id },
    });
  }

  create(createProgramDto: CreateProgramDto) {
    return this.repository.create({
      data: createProgramDto,
    });
  }

  async getManyByQuery(query: ProgramQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const programs = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
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
