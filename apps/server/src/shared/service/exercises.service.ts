import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { ExercisesRepository } from '../repository';
import { CreateExerciseDto, QueryExerciseDto, UpdateExerciseDto } from '@shared/schema';
import { ContextProvider } from '../provider/context.provider';

@Injectable()
export class ExercisesService {
  constructor(private readonly repository: ExercisesRepository) {}

  async create(createExerciseDto: CreateExerciseDto) {
    const tenantId = ContextProvider.getTenantId();
    const { name, count, duration } = createExerciseDto;

    const exercise = await this.repository.create({
      data: {
        name,
        count,
        duration,
        task: {
          create: {
            tenantId,
          },
        },
      },
    });

    return exercise;
  }
  async getManyByQuery(query: QueryExerciseDto) {
    const args = query.toArgs<Prisma.ExerciseFindManyArgs>();
    const countArgs = query.toCountArgs<Prisma.ExerciseCountArgs>();
    const exercises = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);

    return {
      exercises,
      count,
    };
  }

  getById(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  updateById(id: string, updateExerciseDto: UpdateExerciseDto) {
    const { count, duration } = updateExerciseDto;
    return this.repository.update({
      where: { id },
      data: {
        count,
        duration,
      },
    });
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  removeById(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
