import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class GroupEditPage {
  constructor(readonly prisma: PrismaService) {}

  async getMeta(groupId: string | 'new', type: 'add' | 'edit'): Promise<PageBuilder> {
    const page: PageBuilder = {
      name: '그룹',
      type: 'Page',
      state: {
        form: {
          data: {},
        },
      },
      form: {
        name: '정보',
        button: {
          name: '저장',
          mutation: {
            mapper: {
              serviceId: 'serviceId',
            },
            name: 'createGroup',
          },
          alert: {
            message: '!!!',
          },
          navigator: {
            pathname: '..',
          },
        },
        sections: [
          {
            name: '그룹 정보',
            stacks: [
              {
                type: 'VStack',
                inputs: [
                  {
                    type: 'Input',
                    path: 'name',
                    props: {
                      fullWidth: true,
                      label: '그룹 이름',
                      placeholder: '그룹 이름을 입력해주세요.',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    if (groupId !== 'new' && type === 'edit') {
      const group = await this.prisma.group.findUnique({
        where: {
          id: groupId,
        },
      });

      page.state.form.data = group;
      page.form.button.mutation.name = 'updateGroup';
      page.form.button.mutation.id = groupId;
    }

    return page;
  }
}
