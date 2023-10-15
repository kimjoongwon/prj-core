import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './models/workspace.model';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { GetPaginatedWorkspaceArgs } from './dto/get-paginated-workspace.args';
import { PaginatedWorkspace } from './models/paginated-workspace.model';

@Resolver(() => Workspace)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Mutation(() => Workspace)
  createWorkspace(
    @Args('createWorkspaceInput') createWorkspaceInput: CreateWorkspaceInput,
  ) {
    return this.workspacesService.create(createWorkspaceInput);
  }

  @Query(() => PaginatedWorkspace, { name: 'workspaces' })
  getWorkspaces(@Args() getPaginatedWorkspaceArgs: GetPaginatedWorkspaceArgs) {
    return this.workspacesService.findPaginatedWorkspace(
      getPaginatedWorkspaceArgs,
    );
  }

  @Query(() => Workspace, { name: 'workspace' })
  getWorkspace(@Args('id', { type: () => String }) id: string) {
    return this.workspacesService.findById(id);
  }

  @Mutation(() => Workspace)
  updateWorkspace(
    @Args('updateWorkspaceInput') updateWorkspaceInput: UpdateWorkspaceInput,
  ) {
    return this.workspacesService.update(
      updateWorkspaceInput.id,
      updateWorkspaceInput,
    );
  }

  @Mutation(() => Workspace)
  removeWorkspace(@Args('id', { type: () => Int }) id: number) {
    return this.workspacesService.remove(id);
  }
}
