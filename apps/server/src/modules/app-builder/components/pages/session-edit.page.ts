import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PageBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SessionEditPage {
  constructor(readonly prisma: PrismaService) {}

  async getMeta(sessionId: string | 'new', type: 'edit' | 'add') {
    const sessionTypeOptions = [
      {
        text: '일회성',
        value: $Enums.SessionTypes.ONE_TIME,
      },
      {
        text: '반복',
        value: $Enums.SessionTypes.RECURRING,
      },
    ];

    const monthOptions = [
      { text: '1월', value: 1 },
      { text: '2월', value: 2 },
      { text: '3월', value: 3 },
      { text: '4월', value: 4 },
      { text: '5월', value: 5 },
      { text: '6월', value: 6 },
      { text: '7월', value: 7 },
      { text: '8월', value: 8 },
      { text: '9월', value: 9 },
      { text: '10월', value: 10 },
      { text: '11월', value: 11 },
      { text: '12월', value: 12 },
    ];

    const page: PageBuilder = {
      state: {
        form: {
          elements: {},
        },
      },
      name: '새편집',
      form: {
        button: {
          mutation: {
            name: 'createSession',
            invalidationKey: 'sessions',
            payloadPath: 'form',
          },
          name: '저장',
          navigator: {
            type: 'back',
          },
        },
        sections: [
          {
            name: '기본정보',
            stacks: [
              {
                type: 'VStack',
                elements: [
                  {
                    name: 'Input',
                    path: 'form.elements.name',
                    props: {
                      label: '이름',
                    },
                  },

                  {
                    name: 'DateRangePicker',
                    path: 'form.elements.startDateTime,endDateTime',
                    props: {
                      label: '시작 ~ 종료',
                    },
                  },
                  {
                    name: 'Select',
                    path: 'repeatCycleType',
                    visibleCondition: {
                      eq: {
                        path: 'form.elements.name',
                        value: $Enums.SessionTypes.RECURRING,
                      },
                    },
                    props: {
                      label: '반복유형',
                      options: Object.keys($Enums.RepeatCycleTypes).map((key) => ({
                        key,
                        text: $Enums.RepeatCycleTypes[key],
                        value: $Enums.RepeatCycleTypes[key],
                      })),
                    },
                  },
                  {
                    visibleCondition: {
                      eq: {
                        path: 'form.elements.repeatCycleType',
                        value: $Enums.RepeatCycleTypes.WEEKLY,
                      },
                    },
                    name: 'WeekInput',
                    path: 'form.elements.recurringDayOfWeek',
                    props: {
                      label: '반복일',
                    },
                  },
                  {
                    visibleCondition: {
                      eq: {
                        path: 'form.elements.repeatCycleType',
                        value: $Enums.RepeatCycleTypes.MONTHLY,
                      },
                    },
                    name: 'Select',
                    path: 'form.elements.recurringMonth',
                    props: {
                      label: '반복월',
                      options: monthOptions,
                    },
                  },
                  {
                    name: 'Select',
                    path: 'form.elements.type',
                    props: {
                      label: '세션타입',
                      options: sessionTypeOptions,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    if (sessionId !== 'new' && type === 'edit') {
      const session = await this.prisma.session.findUnique({
        where: {
          id: sessionId,
        },
      });
      page.form.button.mutation.name = 'updateSession';
      page.form.button.mutation.id = sessionId;
      page.state.form.elements = session;
    }

    return page;
  }
}
