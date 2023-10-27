import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Service } from './model/service.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { ServicesService } from './services.service';
import { GetServicesArgs } from './dto/get-service.args';
import { PaginatedService } from './model/paginated-service.model';
import { ServiceForm } from './model/service-form.model';
import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';

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
  getCategoryForm(@Args('id') id: string) {
    return this.servicesService.findForm(id);
  }

  @Public()
  @Query(() => PaginatedService, { name: 'services' })
  getServices(@Args() args: GetServicesArgs) {
    return this.servicesService.findPaginatedService(args);
  }
}
