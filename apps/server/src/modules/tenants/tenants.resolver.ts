import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { PaginatedTenant } from './models/paginated-tenant.model';
import { TenantForm } from './models/tenant-form.model';
import { CreateTenantInput } from './dto/create-tenant.input';
import { UpdateTenantInput } from './dto/update-tenant.input';
import { GetTenantsArgs } from './dto/get-tenants.args';
import { GqlAuthGuard } from '../../common/guards';
import { Public } from '../../common/decorators';
import { Tenant } from './models/tenant.model';

@Resolver(() => Tenant)
@UseGuards(GqlAuthGuard)
export class TenantsResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Public()
  @Mutation(() => Tenant)
  createTenant(
    @Args('createTenantInput')
    createTenantInput: CreateTenantInput,
  ) {
    return this.tenantsService.create(createTenantInput);
  }

  @Public()
  @Mutation(() => Tenant)
  updateTenant(
    @Args('updateTenantInput')
    updateTenantInput: UpdateTenantInput,
  ) {
    return this.tenantsService.update(updateTenantInput);
  }

  @Public()
  @Mutation(() => Tenant)
  deleteTenant(@Args('id') id: string) {
    return this.tenantsService.delete(id);
  }

  @Public()
  @Query(() => Tenant, { name: 'tenant' })
  getTenant(@Args('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Public()
  @Query(() => TenantForm, { name: 'tenantForm' })
  getTenantForm() {
    return this.tenantsService.findForm();
  }

  @Public()
  @Query(() => PaginatedTenant, { name: 'tenants' })
  getTenants(@Args() args: GetTenantsArgs) {
    return this.tenantsService.findPaginatedTenant(args);
  }
}
