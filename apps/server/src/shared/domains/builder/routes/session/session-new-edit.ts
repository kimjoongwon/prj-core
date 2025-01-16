import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { RouteBuilder } from '@shared/types';

@Injectable()
export class SessionNewEdit {
  constructor() {}

  getRoute(): RouteBuilder {
    return {
      name: 'SESSION',
      pathname: 'session',
      layout: {
        name: 'SESSION',
        page: {
          form: {
            button: {
              name: '저장',
              mutation: {
                name: 'createSession',
                mapper: {
                  serviceId: 'serviceId',
                  categoryId: 'categoryId',
                  name: 'name',
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
                    type: 'Input',
                    path: 'name',
                    props: {
                      label: '이름',
                      placeholder: '이름을 입력해주세요.',
                    },
                  },
                  {
                    type: 'Select',
                    path: 'type',
                    props: {
                      label: '타입',
                      options: [
                        {
                          key: '1',
                          text: '일회성',
                          value: $Enums.SessionTypes.ONE_TIME,
                        },
                        {
                          key: '2',
                          text: '일회성 범위',
                          value: $Enums.SessionTypes.ONE_TIME_RANGE,
                        },
                        {
                          key: '3',
                          text: '반복',
                          value: $Enums.SessionTypes.RECURRING,
                        },
                      ],
                    },
                  },
                  {
                    type: 'Input',
                    path: 'startTime',
                    props: {
                      label: '시작일',
                      type: 'date',
                    },
                  },
                  {
                    type: 'Input',
                    path: 'endTime',
                    props: {
                      label: '종료일',
                      type: 'date',
                    },
                  },
                  {
                    type: 'Input',
                    path: 'recurringDayOfWeek',
                    props: {
                      label: '요일',
                      placeholder: '요일을 입력해주세요.',
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
