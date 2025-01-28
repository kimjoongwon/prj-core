import { Module } from '@nestjs/common';
import { CategoryEditPage } from '../pages/category-edit.page';
import { CategoryEditRoute } from '../routes/category-edit.route';
import { CategoryForm } from '../forms/category.form';
import { NameInput } from '../inputs';

@Module({
  providers: [CategoryEditRoute, CategoryEditPage, CategoryForm, NameInput],
  exports: [CategoryEditRoute],
})
export class CategoryEditRouteModule {}
