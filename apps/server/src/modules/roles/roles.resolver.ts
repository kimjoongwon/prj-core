import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleForm } from './models/role-form.model';
import { PaginatedRole } from './models/paginated-role.model';
import { CreateRoleInput } from './dto/create-role.input';
import { GetRolesArgs } from './dto/get-roles.args';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from './models/role.model';
import { GqlAuthGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

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
  @Mutation(() => Role)
  removeRole(@Args('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Public()
  @Query(() => Role, { name: 'role' })
  getRole(@Args('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Public()
  @Query(() => RoleForm, { name: 'roleForm' })
  getRoleForm(@Args('id') id: string, @Context() context) {
    console.log('context', context);
    return this.rolesService.findForm(id);
  }

  @Query(() => PaginatedRole, { name: 'roles' })
  getRoles(@Args() args: GetRolesArgs) {
    return this.rolesService.findPaginatedRole(args);
  }
}
