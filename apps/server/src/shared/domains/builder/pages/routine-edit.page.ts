import { Injectable } from '@nestjs/common';
import { FormBuilder, PageBuilder, RouteBuilder } from '@shared/types';
import { RoutinesService } from '../../../services';
import { ContentForm } from '../forms/content.form';
import { CreateRoutineDto } from '../../../dtos/create/create-routine.dto';
import { NameInput } from '../inputs/name.input';

@Injectable()
export class RoutineEditPage {
  constructor(
    readonly routinesService: RoutinesService,
    readonly contentForm: ContentForm,
    readonly nameInput: NameInput,
  ) {}

  async getMeta(routineId: string, type: 'add' | 'edit') {
    const routine = await this.routinesService.getById(routineId);

    const page: PageBuilder = {
      type: 'Page',
      name: '편집',
      state: {
        form: {
          data: {
            name: '',
            tenancyId: '',
            title: '',
            type: 'Textarea',
            description: '',
            dopotId: '',
            text: '',
          } as CreateRoutineDto,
        },
      },
      form: this.getRoutineForm(),
    };

    if (routineId !== 'new' && type === 'edit') {
      page.state.form.data = routine;
      page.form.button.mutation = {
        name: 'updateRoutine',
        id: routineId,
      };
    }

    return page;
  }

  getRoutineForm() {
    const contentForm = this.contentForm.getMeta();
    const nameInput = this.nameInput.getMeta();
    const form: FormBuilder = {
      button: {
        name: '저장',
        mutation: {
          name: 'createRoutine',
        },
      },
      ...contentForm,
    };

    form.sections.unshift({
      name: '기본 정보',
      stacks: [
        {
          type: 'VStack',
          inputs: [nameInput],
        },
      ],
    });

    return form;
  }
}
