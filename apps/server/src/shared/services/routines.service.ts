import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoutinesRepository } from '../repositories/routines.repository';
import { CreateFileDto, CreateRoutineDto, RoutineQueryDto } from '../dtos';
import { AwsService } from '../domains/aws/aws.service';
import { ContextProvider } from '../providers/context.provider';

@Injectable()
export class RoutinesService {
  constructor(
    private readonly repository: RoutinesRepository,
    private readonly awsService: AwsService,
  ) {}

  async create(createRoutineDto: CreateRoutineDto, files: Express.Multer.File[]) {
    const routine = await this.repository.create({
      data: createRoutineDto,
    });

    return routine;
  }
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
