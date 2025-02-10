import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';
import { CreateExerciseDto, defaultCreateExerciseDto } from '../../../dtos';
import { pageBuilder } from '../../../libs';
import { ContextProvider } from '../../../providers';

@Injectable()
export class ExerciseEditPage {
  constructor(readonly prisma: PrismaService) {}

  async getMeta(exerciseId: string | 'new', type: 'add' | 'edit'): Promise<PageBuilder> {
    const page = pageBuilder(CreateExerciseDto, defaultCreateExerciseDto);
    const tenancyId = ContextProvider.getTenancyId();
    const serviceId = ContextProvider.getServiceId();

    page.form.button.mutation.name = 'createExercise';
    page.form.button.mutation.payloadPath = 'form.inputs';

    if (exerciseId !== 'new' && type === 'edit') {
      const exercise = await this.prisma.exercise.findUnique({
        where: {
          id: exerciseId,
        },
      });
      page.state.form.inputs.tenancyId = tenancyId;
      page.state.form.inputs.serviceId = serviceId;
      page.state.form.inputs = exercise;
      page.form.button.mutation.name = 'updateExercise';
      page.form.button.mutation.id = exerciseId;
    }

    return page;
  }
}
