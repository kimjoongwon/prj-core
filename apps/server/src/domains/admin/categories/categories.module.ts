import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoryService } from '@shared';

@Module({
  controllers: [CategoriesController],
  providers: [CategoryService],
})
export class CategoriesModule {}
