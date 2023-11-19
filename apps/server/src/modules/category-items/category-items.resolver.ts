import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoryItemsService } from './category-items.service';
import { Public } from '../../common/decorators';
import { GqlAuthGuard } from '../../common/guards';
import { CreateCategoryItemInput } from './dto/create-category-item.input';
import { GetCategoryItemsArgs } from './dto/get-category-items.args';
import { UpdateCategoryItemInput } from './dto/update-category-item.input';
import { CategoryItemForm } from './model/category-item-form.model';
import { CategoryItem } from './model/category-item.model';
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
  @Query(() => [CategoryItem], { name: 'categoryItemTrees' })
  getCategoryItemTrees() {
    return this.categoryItemsService.findCategoryItemTrees();
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
