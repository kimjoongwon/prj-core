import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserGroupCategoriesService } from './user-group-categories.service';
import { UserGroupCategory } from './entities/user-group-category.entity';
import { CreateUserGroupCategoryInput } from './dto/create-user-group-category.input';
import { UpdateUserGroupCategoryInput } from './dto/update-user-group-category.input';

@Resolver(() => UserGroupCategory)
export class UserGroupCategoriesResolver {
  constructor(
    private readonly userGroupCategoriesService: UserGroupCategoriesService,
  ) {}

  @Mutation(() => UserGroupCategory)
  createUserGroupCategory(
    @Args('createUserGroupCategoryInput')
    createUserGroupCategoryInput: CreateUserGroupCategoryInput,
  ) {
    return this.userGroupCategoriesService.create(createUserGroupCategoryInput);
  }

  @Query(() => [UserGroupCategory], { name: 'userGroupCategories' })
  findAll() {
    return this.userGroupCategoriesService.findAll();
  }

  @Query(() => UserGroupCategory, { name: 'userGroupCategory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userGroupCategoriesService.findOne(id);
  }

  @Mutation(() => UserGroupCategory)
  updateUserGroupCategory(
    @Args('updateUserGroupCategoryInput')
    updateUserGroupCategoryInput: UpdateUserGroupCategoryInput,
  ) {
    return this.userGroupCategoriesService.update(
      updateUserGroupCategoryInput.id,
      updateUserGroupCategoryInput,
    );
  }

  @Mutation(() => UserGroupCategory)
  removeUserGroupCategory(@Args('id', { type: () => Int }) id: number) {
    return this.userGroupCategoriesService.remove(id);
  }
}
