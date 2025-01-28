import { Injectable } from '@nestjs/common';
import { FormBuilder, RouteBuilder } from '@shared/types';

@Injectable()
export class RoutineNewEditBuilder {
  constructor() {}

  getRoutineNewEditRoute(): RouteBuilder {
    return {
      name: '루틴',
      pathname: 'new/edit',
      page: {
        name: '목록',
        type: 'Page',
      },
    };
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
      ],
    };
  }
}
