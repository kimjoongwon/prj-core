import { Module } from '@nestjs/common';
import { CategoriesPage } from '../pages/categories.page';
import { CategoriesRoute } from '../routes/categories.route';
import { CategoryColumns } from '../columns/category.columns';

@Module({
  providers: [CategoriesRoute, CategoriesPage, CategoryColumns],
  exports: [CategoriesRoute],
})
export class CategoriesRouteModule {}
