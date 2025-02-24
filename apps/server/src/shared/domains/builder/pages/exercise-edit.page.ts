import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';
import {
  createDefaultExerciseObject,
  CreateExerciseDto,
  createExerciseValidationObject,
} from '../../../dtos';
import { ContextProvider } from '../../../providers';
import { createTaskValidationObject, defaultCreateTaskDtoObject } from '../../../dtos/task.dto';
import {
  createContentDtoValidationObject,
  defaultCreateContentDto,
} from '../../../dtos/content.dto';

@Injectable()
export class ExerciseEditPage {
  constructor(readonly prisma: PrismaService) {}

  async getMeta(exerciseId: string | 'new', type: 'add' | 'edit'): Promise<PageBuilder> {
    const createExerciseDto: CreateExerciseDto = {
      ...createDefaultExerciseObject,
      task: {
        ...defaultCreateTaskDtoObject,
        content: {
          ...defaultCreateContentDto,
        },
      },
    };

    const tenantId = ContextProvider.getTenantId();
    const page: PageBuilder = {
      state: {
        form: {
          inputs: createExerciseDto as CreateExerciseDto,
        },
      },
      form: {
        validations: {
          ...createExerciseValidationObject,
          task: {
            ...createTaskValidationObject,
            content: {
              ...createContentDtoValidationObject,
            },
          },
        },
      },
    };

    page.state.form.inputs.task.content.tenantId = tenantId;

    if (exerciseId !== 'new' && type === 'edit') {
      const exercise = await this.prisma.exercise.findUnique({
        where: {
          id: exerciseId,
        },
        include: {
          task: {
            include: {
              content: true,
            },
          },
        },
      });
      page.state.form.inputs = exercise;
    }

    return page;
  }
}
