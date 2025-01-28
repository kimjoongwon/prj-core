import { Injectable } from '@nestjs/common';
import { RouteBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CategoryRoute {
  constructor(readonly prisma: PrismaService) {}

  async getMeta(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    const route: RouteBuilder = {
      name: '카테고리',
      pathname: ':categoryId',
      page: {
        query: {
          name: 'useGetCategoryById',
          idMapper: 'categoryId',
        },
        state: {
          form: {
            data: category,
          },
        },
        name: '카테고리',
        form: {
          sections: [
            {
              name: '기본정보',
              stacks: [
                {
                  type: 'VStack',
                  inputs: [
                    {
                      type: 'Input',
                      path: 'name',
                      props: {
                        label: '카테고리 이름',
                        placeholder: '카테고리 이름을 입력해주세요.',
                        readOnly: true,
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
    return route;
  }
}
