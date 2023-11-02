import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { CategoryItem, CategoryItemForm, PaginatedCategoryItem } from './model';
import { CategoryItemsService } from './category-items.service';
import {
  CreateCategoryItemInput,
  GetCategoryItemsArgs,
  UpdateCategoryItemInput,
} from './dto';

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
    @Args('parentIds', {
      type: () => [String],
      nullable: true,
      defaultValue: [null],
    })
    parentIds: (string | null)[],
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
