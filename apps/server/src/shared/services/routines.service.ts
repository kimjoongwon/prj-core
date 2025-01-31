import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoutinesRepository } from '../repositories/routines.repository';
import { CreateRoutineDto, RoutineQueryDto } from '../dtos';
import { DepotsRepository } from '../repositories/depots.repository';

@Injectable()
export class RoutinesService {
  constructor(private readonly repository: RoutinesRepository) {}

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  removeManyByIds(routineIds: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: routineIds,
        },
      },
      data: { removedAt: new Date() },
    });
  }

  delete(args: Prisma.RoutineDeleteArgs) {
    return this.repository.delete(args);
  }

  deleteById(id: string) {
    return this.repository.delete({
      where: { id },
    });
  }

  create(createRoutineDto: CreateRoutineDto, contentFiles: Express.Multer.File[]) {
    return {
      data: {
        ...createRoutineDto,
        contentFiles,
      },
    };
  }

  async getManyByQuery(query: RoutineQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const routines = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      routines,
      count,
    };
  }

  update(args: Prisma.RoutineUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
