import { Module } from '@nestjs/common';
import { CategoriesController, CategoriesService } from '@shared';
import { AdminCategoryController } from './admin-category.controller';
import { CategoryService } from './admin-categories.service';

@Module({
  controllers: [AdminCategoryController, CategoriesController],
  providers: [CategoriesService, CategoryService],
})
export class AdminCategoriesModule {}
