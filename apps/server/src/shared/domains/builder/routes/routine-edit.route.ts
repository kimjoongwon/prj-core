import { Injectable } from '@nestjs/common';
import { FormBuilder, RouteBuilder } from '@shared/types';
import { RoutinesService } from '../../../services';
import { ContentForm } from '../forms/content.form';
import { CreateRoutineDto } from '../../../dtos/create/create-routine.dto';

@Injectable()
export class RoutineEditRoute {
  constructor(
    readonly routinesService: RoutinesService,
    readonly contentForm: ContentForm,
  ) {}

  async getMeta(routineId: string, type: 'add' | 'edit') {
    const routine = await this.routinesService.getById(routineId);

    const route: RouteBuilder = {
      name: '루틴',
      pathname: 'new/edit',
      page: {
        type: 'Page',
        name: '편집',
        state: {
          form: {
            data: {
              name: 'asdasd',
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
      },
    };

    if (routineId !== 'new' && type === 'edit') {
      route.page.state.form.data = routine;
      route.page.form.button.mutation = {
        name: 'updateRoutine',
        id: routineId,
      };
    }

    return route;
  }

  getRoutineForm() {
    const contentForm = this.contentForm.getMeta();
    const form: FormBuilder = {
      button: {
        name: '저장',
        mutation: {
          name: 'createRoutine',
        },
      },
      ...contentForm,
    };

    return form;
  }
}
