import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Public } from '../../common/decorators';
import { GqlAuthGuard } from '../../common/guards';
import { CreateGroupInput } from './dto/create-group.input';
import { GetGroupsArgs } from './dto/get-groups.args';
import { UpdateGroupInput } from './dto/update-group.input';
import { GroupForm } from './models/group-form.model';
import { Group } from './models/group.model';
import { PaginatedGroup } from './models/paginated-group.model';

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
