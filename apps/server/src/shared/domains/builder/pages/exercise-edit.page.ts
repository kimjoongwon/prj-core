import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';
import { CreateExerciseDto, defaultCreateExerciseDto } from '../../../dtos';
import { LabelInput } from '../inputs/label.input';
import { NameInput } from '../inputs/name.input';
import { ContextProvider } from '../../../providers';
import { ContentFormSection } from '../forms/content-form.section';
import { plainToInstance } from 'class-transformer';
import { builder } from '../../../libs/builder';

@Injectable()
export class ExerciseEditPage {
  constructor(
    private readonly labelInput: LabelInput,
    private readonly nameInput: NameInput,
    private readonly contentFormSection: ContentFormSection,
    readonly prisma: PrismaService,
  ) {}

  async getMeta(exerciseId: string | 'new', type: 'add' | 'edit'): Promise<PageBuilder> {
    const taskLabel = this.labelInput.getMeta();
    const taskName = this.nameInput.getMeta();
    const user = ContextProvider.getAuthUser();
    const tenancyId = ContextProvider.getTenancyId();
    const contentFormSection = this.contentFormSection.getMeta();

    const sections = builder(CreateExerciseDto, defaultCreateExerciseDto);

    const page: PageBuilder = {
      name: '그룹',
      type: 'Page',
      state: {
        form: {
          inputs: {} as CreateExerciseDto,
        },
      },
      form: {
        name: '정보',
        button: {
          name: '저장',
          mutation: {
            name: 'createExercise',
            payloadPath: 'form.inputs',
          },
          alert: {
            message: '!!!',
          },
          navigator: {
            pathname: '..',
          },
        },
        sections,
      },
    };

    if (exerciseId !== 'new' && type === 'edit') {
      const exercise = await this.prisma.exercise.findUnique({
        where: {
          id: exerciseId,
        },
      });

      page.state.form.inputs = exercise;
      page.form.button.mutation.name = 'updateExercise';
      page.form.button.mutation.id = exerciseId;
    }

    return page;
  }
}
