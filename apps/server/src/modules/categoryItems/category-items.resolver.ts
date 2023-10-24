import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CategoryItem } from './model/category-item.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { CreateCategoryItemInput } from './dto/create-category-item.input';
import { CategoryItemsService } from './category-items.service';
import { GetCategoryItemsArgs } from './dto/get-category-items.args';
import { PaginatedCategoryItem } from './model/paginated-category.model';
import { CategoryItemForm } from './model/category-form.model';
import { UpdateCategoryItemInput } from './dto/update-category-item.input';

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
  @Query(() => [CategoryItem], { name: 'categoryItemTrees' })
  getCategoryItemTrees(
    @Args('parentIds', { type: () => [String] }) parentIds: string[],
  ) {
    return this.categoryItemsService.findCategoryItemTrees(parentIds);
  }

  @Public()
  @Query(() => CategoryItemForm, { name: 'categoryItemForm' })
  getCategoryForm(@Args('id') id: string) {
    return this.categoryItemsService.findForm(id);
  }

  @Public()
  @Query(() => CategoryItem, { name: 'categoryItem' })
  getCategoryItem(@Args('id') id: string) {
    return this.categoryItemsService.findOne(id);
  }

  @Public()
  @Query(() => PaginatedCategoryItem, { name: 'categoryItems' })
  getCategoryItems(@Args() args: GetCategoryItemsArgs) {
    return this.categoryItemsService.findPaginatedCategoryItem(args);
  }

  @Public()
  @Mutation(() => CategoryItem)
  updateCategoryItem(
    @Args('updateCategoryItemInput')
    updateCategoryInput: UpdateCategoryItemInput,
  ) {
    return this.categoryItemsService.update(updateCategoryInput);
  }

  @Public()
  @Mutation(() => CategoryItem)
  deleteCategoryItem(@Args('id') id: string) {
    return this.categoryItemsService.delete(id);
  }
}
