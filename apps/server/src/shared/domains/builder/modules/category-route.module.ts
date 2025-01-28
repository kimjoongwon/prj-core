import { Module } from '@nestjs/common';
import { CategoryRoute } from '../routes/category.route';

@Module({
  providers: [CategoryRoute],
  exports: [CategoryRoute],
})
export class CategoryRouteModule {}
