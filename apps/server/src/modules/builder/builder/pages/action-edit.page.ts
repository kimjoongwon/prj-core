import { Injectable } from '@nestjs/common';
import { PageBuilder, RouteBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ActionEditPage {
  constructor(private prisma: PrismaService) {}

  async getMeta(): Promise<PageBuilder> {
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
      name: '새편집',
      state: {
        form: {
          inputs: {},
        },
      },
      form: {
        button: {
          name: '저장',
          mutation: {
            name: 'createAction',
            payloadPath: 'form',
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
                    path: 'form.inputs.name',
                    type: 'Input',
                    props: {
                      fullWidth: true,
                      label: '액션 이름',
                      placeholder: '액션 이름을 입력해주세요.',
                    },
                  },
                  {
                    path: 'form.inputs.subjectId',
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
    };
  }
}
