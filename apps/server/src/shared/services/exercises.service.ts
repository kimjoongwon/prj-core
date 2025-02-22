import { Injectable } from '@nestjs/common';
import { ExercisesRepository } from '../repositories';
import { CreateExerciseDto, ExerciseQueryDto, UpdateExerciseDto } from '../dtos';
import { ContextProvider } from '../providers/context.provider';
import { FilesService } from './files.service';
import { CategoryNames } from '../enums/category-names.enum';

@Injectable()
export class ExercisesService {
  constructor(private readonly repository: ExercisesRepository) {}

  async create(createExerciseDto: CreateExerciseDto) {
    const {
      count,
      duration,
      task,
      task: {
        label,
        name,
        content: { type, description, title, text, depotId },
      },
    } = createExerciseDto;
    const tenantId = ContextProvider.getTenantId();

    const exercise = await this.repository.create({
      data: {
        count,
        duration,
        task: {
          create: {
            label,
            name,
            content: {
              create: {
                type,
                description,
                title,
                text,
                tenant: {
                  connect: {
                    id: tenantId,
                  },
                },
                depot: {
                  connect: {
                    id: depotId,
                  },
                },
              },
            },
          },
        },
      },
    });

    return exercise;
  }
  async getManyByQuery(query: ExerciseQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
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
    const { task, count, duration } = updateExerciseDto;
    return this.repository.update({
      where: { id },
      data: {
        count,
        duration,
        task: {
          update: {
            label: task.label,
            name: task.name,
            content: {
              update: {
                type: task.content.type,
                description: task.content.description,
                title: task.content.title,
                text: task.content.text,
              },
            },
          },
        },
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
