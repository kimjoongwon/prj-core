import { Module } from '@nestjs/common';
import { CategoryItemsService } from './category-items.service';
import { CategoryItemsResolver } from './category-items.resolver';

@Module({
  providers: [CategoryItemsResolver, CategoryItemsService],
})
export class CategoryItemsModule {}
