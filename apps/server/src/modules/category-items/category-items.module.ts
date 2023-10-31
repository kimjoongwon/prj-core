import { Module } from '@nestjs/common';
import { CategoryItemsService } from './category-items.service';
import { CategoryItemsResolver } from './category-items.resolver';

@Module({
  providers: [CategoryItemsResolver, CategoryItemsService],
  exports: [CategoryItemsService],
})
export class CategoryItemsModule {}
