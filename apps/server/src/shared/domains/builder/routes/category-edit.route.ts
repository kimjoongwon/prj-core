import { RouteBuilder } from '@shared/types';
import { CategoryEditPage } from '../pages/category-edit.page';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryEditRoute {
  constructor(private readonly categoryEditPage: CategoryEditPage) {}

  async getMeta(categoryId: string | 'new', type: 'edit' | 'add') {
    const page = await this.categoryEditPage.getMeta(categoryId, type);

    const route: RouteBuilder = {
      name: '편집',
      pathname: `${categoryId}/:type`,
      page,
    };

    return route;
  }
}
