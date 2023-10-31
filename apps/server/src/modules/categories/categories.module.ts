import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { ServicesModule } from '@modules/services/services.module';
import { CategoryItemsModule } from '@modules/category-items/category-items.module';

@Module({
  imports: [ServicesModule, CategoryItemsModule],
  providers: [CategoriesResolver, CategoriesService],
})
export class CategoriesModule {}
