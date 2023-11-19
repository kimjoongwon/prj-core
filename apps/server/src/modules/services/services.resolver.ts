import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Public } from '../../common/decorators';
import { GqlAuthGuard } from '../../common/guards';
import { PaginatedService } from './models/paginated-service.model';
import { ServiceForm } from './models/service-form.model';
import { Service } from './models/service.model';
import { CreateServiceInput } from './dto/create-service.input';
import { GetServicesArgs } from './dto/get-services.args';
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
  getCategoryForm() {
    return this.servicesService.findForm();
  }

  @Public()
  @Query(() => PaginatedService, { name: 'services' })
  getServices(@Args() args: GetServicesArgs) {
    return this.servicesService.findPaginatedService(args);
  }
}
