import { Injectable } from '@nestjs/common';
import { RouteBuilder } from '@shared/types';

@Injectable()
export class TimelineNewEdit {
  constructor() {}

  getRoute(): RouteBuilder {
    return {
      name: '타임라인',
      pathname: 'new/edit',
      layout: {
        type: 'Modal',
        name: '새편집',
        page: {
          state: {
            form: {
              data: {
                startTime: new Date().toISOString(),
              },
            },
          },
          name: '새편집',
          form: {
            button: {
              mutation: {
                name: 'createTimeline',
              },
              navigator: {
                pathname: '..',
              },
              name: '저장',
            },
            sections: [
              {
                name: '기본정보',
                components: [
                  {
                    type: 'Input',
                    path: 'name',
                    props: {
                      label: '타임라인명',
                      placeholder: '타임라인명을 입력하세요',
                    },
                  },
                  {
                    type: 'Outlet',
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
