import { PageBuilder } from '@shared/types';
import { CategoryForm } from '../forms/category.form';
import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../../../dtos';
import { ContextProvider } from '../../../providers';

@Injectable()
export class CategoryEditPage {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryForm: CategoryForm,
  ) {}

  async getMeta(categoryId: string | 'new', type: 'edit' | 'add') {
    const form = this.categoryForm.getMeta();
    const serviceId = ContextProvider.getServiceId();
    const tenancyId = ContextProvider.getTenancyId();

    const page: PageBuilder = {
      type: 'Page',
      name: '새편집',
      state: {
        form: {
          serviceId,
          tenancyId,
          name: '',
          type: 'ROOT',
          parentId: null,
        } as CreateCategoryDto,
      },
      form,
    };

    if (categoryId !== 'new' && type === 'edit') {
      const category = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      page.state.form.data = category;
      page.form.button.mutation.name = 'updateCategory';
      page.form.button.mutation.id = categoryId;
    }

    if (categoryId !== 'new' && type === 'add') {
      page.state.form.data.type = 'LEAF';
      page.state.form.data.parentId = categoryId;
      page.form.button.mutation.name = 'createCategory';
      page.form.button.mutation.payloadPath = 'form.data';
    }

    return page;
  }
}
