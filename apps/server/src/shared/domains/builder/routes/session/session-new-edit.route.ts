import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { RouteBuilder } from '@shared/types';
import { P } from 'ts-pattern';

@Injectable()
export class SessionNewEdit {
  constructor() {}

  getRoute(): RouteBuilder {
    const sessionTypeOptions = [
      {
        text: '일회성',
        value: $Enums.SessionTypes.ONE_TIME,
      },
      {
        text: '반복',
        value: $Enums.SessionTypes.RECURRING,
      },
      {
        text: '일회성 범위',
        value: $Enums.SessionTypes.ONE_TIME_RANGE,
      },
    ];

    return {
      name: '세션',
      pathname: 'new/edit',
      layout: {
        type: 'Modal',
        name: '새편집',
        page: {
          state: {
            form: {
              data: {},
            },
          },
          name: '새편집',
          form: {
            button: {
              mutation: {
                name: 'createSession',
              },
              name: '저장',
            },
            sections: [
              {
                name: '기본정보',
                components: [
                  {
                    type: 'Select',
                    path: 'type',
                    props: {
                      label: '세션타입',
                      options: sessionTypeOptions,
                    },
                  },
                  {
                    type: 'Input',
                    props: {
                      label: '이름',
                      name: 'name',
                    },
                  },
                  {
                    type: 'TimeInput',
                    path: 'startTime',
                    props: {
                      label: '시작시간',
                    },
                  },
                  {
                    type: 'TimeInput',
                    path: 'endTime',
                    props: {
                      label: '종료시간',
                    },
                  },
                  {
                    type: 'DateRangePicker',
                    path: 'startDateTime,endDateTime',
                    props: {
                      label: '시작일자 ~ 종료일자',
                    },
                  },
                  {
                    type: 'DatePicker',
                    path: 'baseDate',
                    props: {
                      label: '기준일자',
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
