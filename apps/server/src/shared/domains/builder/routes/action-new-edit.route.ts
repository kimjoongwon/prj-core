import { Injectable } from '@nestjs/common';
import { RouteBuilder } from '@shared/types';

@Injectable()
export class ActionNewEditRoute {
  constructor() {}

  getRoute(): RouteBuilder {
    return {
      name: '액션새편집',
      pathname: 'new/edit',
      layout: {
        name: '새편집',
        type: 'Modal',
        page: {
          name: '새편집',
          state: {
            form: {
              data: {},
            },
          },
          form: {
            button: {
              name: '저장',
              mutation: {
                name: 'createAction',
                mapper: {
                  serviceId: 'serviceId',
                },
              },
              navigator: {
                pathname: '..',
              },
            },
            sections: [
              {
                name: '기본정보',
                components: [
                  {
                    path: 'name',
                    type: 'Input',
                    props: {
                      fullWidth: true,
                      label: '액션 이름',
                      placeholder: '액션 이름을 입력해주세요.',
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    };
  }
}
