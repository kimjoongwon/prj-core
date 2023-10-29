import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { RolesService } from './roles.service';
import { PaginatedRole, Role, RoleForm } from './models';
import { CreateRoleInput, GetRolesArgs, UpdateRoleInput } from './dto';

@Resolver(() => Role)
@UseGuards(GqlAuthGuard)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Public()
  @Mutation(() => Role)
  createRole(
    @Args('createRoleInput')
    createRoleInput: CreateRoleInput,
  ) {
    return this.rolesService.create(createRoleInput);
  }

  @Public()
  @Mutation(() => Role)
  updateRole(
    @Args('updateRoleInput')
    updateRoleInput: UpdateRoleInput,
  ) {
    return this.rolesService.update(updateRoleInput);
  }

  @Public()
  @Mutation(() => Role)
  deleteRole(@Args('id') id: string) {
    return this.rolesService.delete(id);
  }

  @Public()
  @Query(() => Role, { name: 'role' })
  getRole(@Args('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Public()
  @Query(() => RoleForm, { name: 'roleForm' })
  getRoleForm() {
    return this.rolesService.findForm();
  }

  @Public()
  @Query(() => PaginatedRole, { name: 'roles' })
  getRoles(@Args() args: GetRolesArgs) {
    return this.rolesService.findPaginatedRole(args);
  }
}
