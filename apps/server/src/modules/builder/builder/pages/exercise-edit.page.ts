import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';
import { CreateExerciseDto } from '../../../../shared/dto';
import { ContextProvider } from '../../../../shared/provider';
import {
  createContentDtoValidationObject,
  defaultCreateContentDto,
} from '../../../../shared/dto/content.dto';

@Injectable()
export class ExerciseEditPage {
  constructor(readonly prisma: PrismaService) {}

  async getMeta(exerciseId: string | 'new', type: 'add' | 'edit'): Promise<PageBuilder> {
    const createExerciseDto: CreateExerciseDto = {
      tenantId: '',
      name: '',
      description: '',
      imageDepotId: '',
      videoDepotId: '',
      duration: 0,
      count: 0,
    };

    const tenantId = ContextProvider.getTenantId();
    const page: PageBuilder<CreateExerciseDto> = {
      state: {
        form: {
          inputs: createExerciseDto,
        },
      },
      form: {
        validations: {},
      },
    };

    page.state.form.inputs.tenantId = tenantId;

    if (exerciseId !== 'new' && type === 'edit') {
      const exercise = await this.prisma.exercise.findUnique({
        where: {
          id: exerciseId,
        },
      });
    }

    return page;
  }
}
