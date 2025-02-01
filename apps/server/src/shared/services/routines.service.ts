import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoutinesRepository } from '../repositories/routines.repository';
import { CreateRoutineDto, RoutineQueryDto } from '../dtos';
import { DepotsService } from './depots.service';

@Injectable()
export class RoutinesService {
  constructor(
    private readonly repository: RoutinesRepository,
    private readonly depotsService: DepotsService,
  ) {}

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

  async create(
    { description, title, type, text, name, tenancyId }: CreateRoutineDto,
    files: Express.Multer.File[],
  ) {
    const depot = await this.depotsService.create(files);

    const routine = await this.repository.create({
      data: {
        name,
        tenancyId,
        content: {
          create: {
            description,
            title,
            type,
            text,
            dopotId: depot.id,
          },
        },
      },
    });

    return routine;
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
