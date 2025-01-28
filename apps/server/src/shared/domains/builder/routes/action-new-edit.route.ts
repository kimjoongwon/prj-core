import { Injectable } from '@nestjs/common';
import { RouteBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ActionNewEditRoute {
  constructor(private prisma: PrismaService) {}

  async getRoute(): Promise<RouteBuilder> {
    const subjects = await this.prisma.subject.findMany({
      where: {
        removedAt: null,
      },
    });
    const subjectOptions = subjects.map((subject) => ({
      key: subject.id,
      text: subject.name,
      value: subject.id,
    }));

    return {
      name: '액션새편집',
      pathname: 'new/edit',
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
            },
            navigator: {
              pathname: '..',
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
                      path: 'name',
                      type: 'Input',
                      props: {
                        fullWidth: true,
                        label: '액션 이름',
                        placeholder: '액션 이름을 입력해주세요.',
                      },
                    },
                    {
                      path: 'subjectId',
                      type: 'Select',
                      props: {
                        fullWidth: true,
                        label: '과목',
                        options: subjectOptions,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };
  }
}
