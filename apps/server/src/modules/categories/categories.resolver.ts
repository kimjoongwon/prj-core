import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Category } from './models/category.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { CategoriesService } from './categories.service';
import { GetCategoriesArgs } from './dto/get-categories.args';
import { PaginatedCategory } from './models/paginated-category.model';
import { CreateCategoryInput } from './dto/create-category.input';
import { CategoryForm } from './models/category-form.model';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => Category)
@UseGuards(GqlAuthGuard)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Public()
  @Mutation(() => Category)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(updateCategoryInput);
  }

  @Public()
  @Query(() => CategoryForm, { name: 'categoryForm' })
  getCategoryForm(@Args('id') id: string) {
    return this.categoriesService.findForm(id);
  }

  @Public()
  @Query(() => PaginatedCategory, { name: 'categories' })
  getCategories(@Args() args: GetCategoriesArgs) {
    return this.categoriesService.findPaginatedCategory(args);
  }
}
