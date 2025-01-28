import { PageBuilder } from '@shared/types';
import { CategoryForm } from '../forms/category.form';
import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryEditPage {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryForm: CategoryForm,
  ) {}

  async getMeta(categoryId: string | 'new', type: 'edit' | 'add') {
    console.log('type', type);
    const form = this.categoryForm.getMeta();

    const page: PageBuilder = {
      type: 'Page',
      name: '새편집',
      state: {
        form: {
          data: {
            name: '',
            type: 'ROOT',
            parentId: null,
          },
        },
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
      page.form.button.mutation.idMapper = 'categoryId';
    }

    if (categoryId !== 'new' && type === 'add') {
      page.state.form.data.type = 'LEAF';
      page.state.form.data.parentId = categoryId;
      page.form.button.mutation.name = 'createCategory';
    }
    console.log('page', page.state.form, 4);
    return page;
  }
}
