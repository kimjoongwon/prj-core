import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { WorkspacesService } from './workspaces.service';
import { PaginatedWorkspace, Workspace, WorkspaceForm } from './models';
import {
  CreateWorkspaceInput,
  GetWorkspacesArgs,
  UpdateWorkspaceInput,
} from './dto';

@Resolver(() => Workspace)
@UseGuards(GqlAuthGuard)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Public()
  @Mutation(() => Workspace)
  createWorkspace(
    @Args('createWorkspaceInput')
    createWorkspaceInput: CreateWorkspaceInput,
  ) {
    return this.workspacesService.create(createWorkspaceInput);
  }

  @Public()
  @Mutation(() => Workspace)
  updateWorkspace(
    @Args('updateWorkspaceInput')
    updateWorkspaceInput: UpdateWorkspaceInput,
  ) {
    return this.workspacesService.update(updateWorkspaceInput);
  }

  @Public()
  @Mutation(() => Workspace)
  deleteWorkspace(@Args('id') id: string) {
    return this.workspacesService.delete(id);
  }

  @Public()
  @Query(() => Workspace, { name: 'workspace' })
  getWorkspace(@Args('id') id: string) {
    return this.workspacesService.findOne(id);
  }

  @Public()
  @Query(() => WorkspaceForm, { name: 'workspaceForm' })
  getWorkspaceForm() {
    return this.workspacesService.findForm();
  }

  @Public()
  @Query(() => PaginatedWorkspace, { name: 'workspaces' })
  getWorkspaces(@Args() args: GetWorkspacesArgs) {
    return this.workspacesService.findPaginatedWorkspace(args);
  }
}
