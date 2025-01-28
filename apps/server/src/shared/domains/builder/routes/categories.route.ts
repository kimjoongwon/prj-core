import { CategoriesPage } from '../pages/categories.page';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesRoute {
  constructor(private readonly categoriesPage: CategoriesPage) {}

  getMeta() {
    const page = this.categoriesPage.getMeta();
    const route = {
      name: '카테고리',
      pathname: 'categories',
      page,
    };
    return route;
  }
}
