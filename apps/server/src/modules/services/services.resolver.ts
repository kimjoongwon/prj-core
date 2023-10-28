import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { ServicesService } from './services.service';
import { PaginatedService, Service, ServiceForm } from './models';
import { CreateServiceInput, GetServicesArgs, UpdateServiceInput } from './dto';

@Resolver(() => Service)
@UseGuards(GqlAuthGuard)
export class ServicesResolver {
  constructor(private readonly servicesService: ServicesService) {}

  @Public()
  @Mutation(() => Service)
  createService(
    @Args('createServiceInput')
    createCategoryInput: CreateServiceInput,
  ) {
    return this.servicesService.create(createCategoryInput);
  }

  @Public()
  @Mutation(() => Service)
  updateService(
    @Args('updateServiceInput')
    updateCategoryInput: UpdateServiceInput,
  ) {
    return this.servicesService.update(updateCategoryInput);
  }

  @Public()
  @Mutation(() => Service)
  deleteService(@Args('id') id: string) {
    return this.servicesService.delete(id);
  }

  @Public()
  @Query(() => Service, { name: 'service' })
  getService(@Args('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Public()
  @Query(() => ServiceForm, { name: 'serviceForm' })
  getCategoryForm() {
    return this.servicesService.findForm();
  }

  @Public()
  @Query(() => PaginatedService, { name: 'services' })
  getServices(@Args() args: GetServicesArgs) {
    return this.servicesService.findPaginatedService(args);
  }
}
