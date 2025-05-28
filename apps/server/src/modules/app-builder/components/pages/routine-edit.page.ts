import { Injectable } from '@nestjs/common';
import { ContextProvider, CreateRoutineDto, RoutinesService } from '@shared';
import { FormBuilder, PageBuilder } from '@shared/types';

@Injectable()
export class RoutineEditPage {
  constructor(readonly routinesService: RoutinesService) {}

  async getMeta(routineId: string, type: 'add' | 'edit') {
    const tenancyId = ContextProvider.getTenancyId();
    const routine = await this.routinesService.getById(routineId);

    const page: PageBuilder = {
      type: 'Page',
      name: '편집',
      state: {
        form: {
          inputs: {} as CreateRoutineDto,
        },
      },
      form: this.getRoutineForm(),
    };

    if (routineId !== 'new' && type === 'edit') {
      page.state.form.inputs = routine;
      page.form.button.mutation = {
        name: 'updateRoutine',
        id: routineId,
        payloadPath: 'form',
      };
    }

    return page;
  }

  getRoutineForm() {
    const form: FormBuilder = {
      button: {
        name: '저장',
        mutation: {
          name: 'createRoutine',
          payloadPath: 'form',
        },
      },
      sections: [],
    };

    return form;
  }
}
