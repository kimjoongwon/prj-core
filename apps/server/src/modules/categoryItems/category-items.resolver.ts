import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CategoryItem } from './model/category-item.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { CreateCategoryItemInput } from './dto/create-category-item.input';
import { CategoryItemsService } from './category-items.service';
import { GetCategoryItemsArgs } from './dto/get-category-items.args';
import { PaginatedCategoryItem } from './model/paginated-category.model';

@Resolver(() => CategoryItem)
@UseGuards(GqlAuthGuard)
export class CategoryItemsResolver {
  constructor(private readonly categoryItemsService: CategoryItemsService) {}

  @Public()
  @Mutation(() => CategoryItem)
  createCategoryItem(
    @Args('createCategoryItemInput')
    createCategoryInput: CreateCategoryItemInput,
  ) {
    return this.categoryItemsService.create(createCategoryInput);
  }

  @Public()
  @Query(() => PaginatedCategoryItem, { name: 'categoryItems' })
  getCategories(@Args() args: GetCategoryItemsArgs) {
    return this.categoryItemsService.findPaginatedCategoryItem(args);
  }
}
