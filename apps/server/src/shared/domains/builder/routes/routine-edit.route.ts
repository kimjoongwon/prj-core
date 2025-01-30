import { Injectable } from '@nestjs/common';
import { FormBuilder, RouteBuilder } from '@shared/types';
import { RoutinesService } from '../../../services';

@Injectable()
export class RoutineEditRoute {
  constructor(readonly routinesService: RoutinesService) {}

  async getMeta(routineId: string, type: 'add' | 'edit') {
    const routine = await this.routinesService.getById(routineId);

    const route: RouteBuilder = {
      name: '루틴',
      pathname: 'new/edit',
      page: {
        name: '목록',
        type: 'Page',
        form: this.getRoutineForm(),
      },
    };

    if (routineId !== 'new' && type === 'edit') {
      route.page.state.form.data = routine;
      route.page.form.button.mutation = {
        name: 'updateRoutine',
        idMapper: 'routineId',
      };
    }

    return route;
  }

  getRoutineForm(): FormBuilder {
    return {
      button: {
        name: '저장',
        mutation: {
          name: 'createRoutine',
        },
      },
      sections: [
        {
          name: '기본정보',
          stacks: [
            {
              type: 'VStack',
              inputs: [
                {
                  type: 'Input',
                  path: 'name',
                  props: {
                    label: '루틴 이름',
                    placeholder: '루틴 이름을 입력해주세요.',
                  },
                },
              ],
            },
          ],
        },
        {
          name: '콘텐츠 정보',
          stacks: [
            {
              type: 'VStack',
              inputs: [
                {
                  type: 'Content',
                },
              ],
            },
          ],
        },
      ],
    };
  }
}
