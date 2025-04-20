import { PageBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../../../dtos';
import { ContextProvider } from '../../../providers';
import { FormBuilderService } from '../form/form-builder.service';
import { InputBuilderService } from '../Input/Input-builder.service';

@Injectable()
export class CategoryPage {
  constructor(
    private readonly prisma: PrismaService,
    private readonly formBuilderService: FormBuilderService,
    private readonly inputBuilderService: InputBuilderService,
  ) { }

  private getDefaultCDO(): CreateCategoryDto {
    return {
      name: '',
      parentId: undefined,
      serviceId: ContextProvider.getServiceId(),
      tenantId: ContextProvider.getTenantId(),
      type: 'ROOT',
    };
  }

  async build(categoryId: string | 'new', type: 'edit' | 'add' | 'detail') {
    const isAdd = type === 'add';
    const isDetail = type === 'detail';
    const isUpdate = categoryId !== 'new' && type === 'edit';

    const inputs = this.inputBuilderService.build(['name']);
    const form = this.formBuilderService.build({
      button: {
        name: isUpdate ? '수정' : '생성',
        mutation: {
          invalidationKey: '/api/v1/categories',
          name: isUpdate ? 'updateCategory' : 'createCategory',
          params: {
            type: 'ROOT',
            parentId: undefined,
            serviceId: ContextProvider.getServiceId(),
            tenantId: ContextProvider.getTenantId(),
          },
        },
        navigator: {
          type: 'back',
        },
        toast: {
          title: '성공',
          description: isUpdate ? '카테고리가 수정되었습니다.' : '카테고리가 생성되었습니다.',
        },
      },
      sections: [
        {
          name: '기본 정보',
          stacks: [
            {
              type: 'VStack',
              inputs,
            },
          ],
        },
      ],
    });

    const page: PageBuilder = {
      name: '카테고리',
      state: {
        form: {
          inputs: this.getDefaultCDO(),
        },
      },
      form,
    };

    if (isUpdate) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      page.state.form.inputs = category;
      page.form.button.mutation.name = 'updateCategory';
      page.form.button.mutation.id = categoryId;
    }

    if (isAdd) {
      page.state.form.inputs.type = 'LEAF';
      page.state.form.inputs.parentId = categoryId;
      page.form.button.mutation.name = 'createCategory';
      page.form.button.mutation.payloadPath = 'form.inputs';
    }

    if (isDetail) {
      page.state.form.inputs = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      page.form.button = undefined;
    }

    return page;
  }
}
