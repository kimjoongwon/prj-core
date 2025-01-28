import { Injectable } from '@nestjs/common';
import { RouteBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class GroupEditRoute {
  constructor(readonly prisma: PrismaService) {}

  async getMeta(groupId: string | 'new', type: 'add' | 'edit'): Promise<RouteBuilder> {
    const route: RouteBuilder = {
      name: '그룹 생성',
      pathname: 'new/edit',
      page: {
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
      },
    };

    if (groupId !== 'new' && type === 'edit') {
      const group = await this.prisma.group.findUnique({
        where: {
          id: groupId,
        },
      });

      route.page.state.form.data = group;
      route.page.form.button.mutation.name = 'updateGroup';
      route.page.form.button.mutation.idMapper = 'groupId';
    }

    return route;
  }
}
