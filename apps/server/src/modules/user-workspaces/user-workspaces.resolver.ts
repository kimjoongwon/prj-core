import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserWorkspacesService } from './user-workspaces.service';
import { UserWorkspace } from './entities/user-workspace.entity';
import { CreateUserWorkspaceInput } from './dto/create-user-workspace.input';
import { UpdateUserWorkspaceInput } from './dto/update-user-workspace.input';

@Resolver(() => UserWorkspace)
export class UserWorkspacesResolver {
  constructor(private readonly userWorkspacesService: UserWorkspacesService) {}

  @Mutation(() => UserWorkspace)
  createUserWorkspace(
    @Args('createUserWorkspaceInput')
    createUserWorkspaceInput: CreateUserWorkspaceInput,
  ) {
    return this.userWorkspacesService.create(createUserWorkspaceInput);
  }

  @Query(() => [UserWorkspace], { name: 'userWorkspaces' })
  findAll() {
    return this.userWorkspacesService.findAll();
  }

  @Query(() => UserWorkspace, { name: 'userWorkspace' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userWorkspacesService.findOne(id);
  }

  @Mutation(() => UserWorkspace)
  updateUserWorkspace(
    @Args('updateUserWorkspaceInput')
    updateUserWorkspaceInput: UpdateUserWorkspaceInput,
  ) {
    return this.userWorkspacesService.update(
      updateUserWorkspaceInput.id,
      updateUserWorkspaceInput,
    );
  }

  @Mutation(() => UserWorkspace)
  removeUserWorkspace(@Args('id', { type: () => Int }) id: number) {
    return this.userWorkspacesService.remove(id);
  }
}
