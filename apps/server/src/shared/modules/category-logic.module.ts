import { Module } from '@nestjs/common';
import { CategoriesRepository, CategoriesService } from '@shared';
import { CategoryLogic } from '../logic/category.logic';

@Module({
  providers: [CategoryLogic, CategoriesService, CategoriesRepository],
  exports: [CategoriesService, CategoryLogic],
})
export class CategoryLogicModule {}
