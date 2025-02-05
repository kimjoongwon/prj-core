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
          data: {},
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
                inputs: [
                  {
                    type: 'Input',
                    path: 'form.input.name',
                    props: {
                      label: '이름',
                    },
                  },

                  {
                    type: 'DateRangePicker',
                    path: 'form.input.startDateTime,endDateTime',
                    props: {
                      label: '시작 ~ 종료',
                    },
                  },
                  {
                    type: 'Select',
                    path: 'repeatCycleType',
                    visibleCondition: {
                      eq: {
                        path: 'form.input.type',
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
                        path: 'form.input.repeatCycleType',
                        value: $Enums.RepeatCycleTypes.WEEKLY,
                      },
                    },
                    type: 'WeekInput',
                    path: 'form.input.recurringDayOfWeek',
                    props: {
                      label: '반복일',
                    },
                  },
                  {
                    visibleCondition: {
                      eq: {
                        path: 'form.input.repeatCycleType',
                        value: $Enums.RepeatCycleTypes.MONTHLY,
                      },
                    },
                    type: 'Select',
                    path: 'form.input.recurringMonth',
                    props: {
                      label: '반복월',
                      options: monthOptions,
                    },
                  },
                  {
                    type: 'Select',
                    path: 'form.input.type',
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
      page.state.form.input = session;
    }

    return page;
  }
}
