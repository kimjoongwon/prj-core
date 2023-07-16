import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserGroupsService } from './user-groups.service';
import { UserGroup } from './entities/user-group.entity';
import { CreateUserGroupInput } from './dto/create-user-group.input';
import { UpdateUserGroupInput } from './dto/update-user-group.input';

@Resolver(() => UserGroup)
export class UserGroupsResolver {
  constructor(private readonly userGroupsService: UserGroupsService) {}

  @Mutation(() => UserGroup)
  createUserGroup(
    @Args('createUserGroupInput') createUserGroupInput: CreateUserGroupInput,
  ) {
    return this.userGroupsService.create(createUserGroupInput);
  }

  @Query(() => [UserGroup], { name: 'userGroups' })
  findAll() {
    return this.userGroupsService.findAll();
  }

  @Query(() => UserGroup, { name: 'userGroup' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userGroupsService.findOne(id);
  }

  @Mutation(() => UserGroup)
  updateUserGroup(
    @Args('updateUserGroupInput') updateUserGroupInput: UpdateUserGroupInput,
  ) {
    return this.userGroupsService.update(
      updateUserGroupInput.id,
      updateUserGroupInput,
    );
  }

  @Mutation(() => UserGroup)
  removeUserGroup(@Args('id', { type: () => Int }) id: number) {
    return this.userGroupsService.remove(id);
  }
}
