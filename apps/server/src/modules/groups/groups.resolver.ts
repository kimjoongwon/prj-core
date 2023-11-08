import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { GroupsService } from './groups.service';
import { PaginatedGroup, Group, GroupForm } from './models';
import { CreateGroupInput, GetGroupsArgs, UpdateGroupInput } from './dto';

@Resolver(() => Group)
@UseGuards(GqlAuthGuard)
export class GroupsResolver {
  constructor(private readonly groupsService: GroupsService) {}

  @Public()
  @Mutation(() => Group)
  createGroup(
    @Args('createGroupInput')
    createGroupInput: CreateGroupInput,
  ) {
    return this.groupsService.create(createGroupInput);
  }

  @Public()
  @Mutation(() => Group)
  updateGroup(
    @Args('updateGroupInput')
    updateGroupInput: UpdateGroupInput,
  ) {
    return this.groupsService.update(updateGroupInput);
  }

  @Public()
  @Mutation(() => Group)
  deleteGroup(@Args('id') id: string) {
    return this.groupsService.delete(id);
  }

  @Public()
  @Query(() => Group, { name: 'group' })
  getGroup(@Args('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Public()
  @Query(() => GroupForm, { name: 'groupForm' })
  getGroupForm(@Args('id') id: string) {
    return this.groupsService.findForm(id);
  }

  @Public()
  @Query(() => PaginatedGroup, { name: 'groups' })
  getGroups(@Args() args: GetGroupsArgs) {
    return this.groupsService.findPaginatedGroup(args);
  }
}
